<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // GET /api/transactions
    public function index(Request $request)
    {
        $query = Transaction::with(['agent', 'commande', 'validePar'])
            ->orderBy('date_transaction', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('statut_validation')) {
            $query->where('statut_validation', $request->statut_validation);
        }
        if ($request->filled('mois') && $request->filled('annee')) {
            $query->whereMonth('date_transaction', $request->mois)
                  ->whereYear('date_transaction',  $request->annee);
        }
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('reference',    'like', "%$q%")
                   ->orWhere('categorie',  'like', "%$q%")
                   ->orWhere('description','like', "%$q%");
            });
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        return response()->json($query->paginate($perPage));
    }

    // GET /api/transactions/stats
    public function stats(Request $request)
    {
        $annee = $request->get('annee', now()->year);
        $mois  = $request->get('mois',  now()->month);

        $base = Transaction::where('statut_validation', 'VALIDE')
            ->whereYear('date_transaction', $annee)
            ->whereMonth('date_transaction', $mois);

        $entrees          = (clone $base)->where('type', 'ENTREE')->sum('montant');
        $sorties          = (clone $base)->where('type', 'SORTIE')->sum('montant');
        $entreesManuelles = (clone $base)->where('type', 'ENTREE')->whereNull('versement_id')->sum('montant');
        $entreesVersements= (clone $base)->where('type', 'ENTREE')->whereNotNull('versement_id')->sum('montant');

        // Évolution sur 6 mois
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $m    = $date->month;
            $a    = $date->year;

            $baseEvol = Transaction::where('statut_validation', 'VALIDE')
                ->whereYear('date_transaction', $a)
                ->whereMonth('date_transaction', $m);

            $e = (clone $baseEvol)->where('type', 'ENTREE')->sum('montant');
            $s = (clone $baseEvol)->where('type', 'SORTIE')->sum('montant');

            $evolution[] = [
                'mois'               => $date->locale('fr')->isoFormat('MMM'),
                'entrees'            => (float) $e,
                'entrees_manuelles'  => (float) (clone $baseEvol)->where('type', 'ENTREE')->whereNull('versement_id')->sum('montant'),
                'entrees_versements' => (float) (clone $baseEvol)->where('type', 'ENTREE')->whereNotNull('versement_id')->sum('montant'),
                'sorties'            => (float) $s,
                'solde'              => (float) ($e - $s),
            ];
        }

        return response()->json([
            'entrees'            => (float) $entrees,
            'entrees_manuelles'  => (float) $entreesManuelles,
            'entrees_versements' => (float) $entreesVersements,
            'sorties'            => (float) $sorties,
            'solde'              => (float) ($entrees - $sorties),
            'evolution'          => $evolution,
        ]);
    }

    // POST /api/transactions
    public function store(Request $request)
    {
        $data = $request->validate([
            'type'             => 'required|in:ENTREE,SORTIE',
            'categorie'        => 'required|string|max:100',
            'montant'          => 'required|numeric|min:1',
            'date_transaction' => 'required|date',
            'commande_id'      => 'nullable|exists:commandes,id',
            'description'      => 'nullable|string',
        ]);

        $transaction = Transaction::create([
            ...$data,
            'reference'         => $this->genererReference($data['type']),
            'agent_id'          => $request->user()->id,
            'statut_validation' => 'VALIDE',
        ]);

        return response()->json(
            $transaction->load(['agent', 'commande']),
            201
        );
    }

    // PATCH /api/transactions/{id}/valider
    public function valider(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'statut_validation' => 'required|in:VALIDE,REJETE',
        ]);

        $transaction->update([
            'statut_validation' => $data['statut_validation'],
            'valide_par'        => $request->user()->id,
        ]);

        return response()->json($transaction->fresh());
    }

    // DELETE /api/transactions/{id}
    public function destroy(Transaction $transaction)
    {
        if ($transaction->versement_id !== null) {
            return response()->json([
                'message' => 'Cette transaction est liée à un versement. Supprimez le versement pour l\'annuler.',
            ], 422);
        }

        $transaction->delete();
        return response()->json(null, 204);
    }

    // ── Helper ──────────────────────────────────────────────
    private function genererReference(string $type): string
    {
        $prefix  = $type === 'ENTREE' ? 'ENT' : 'SOR';
        $mois    = strtoupper(now()->locale('fr')->isoFormat('MMM'));
        $dernier = Transaction::where('type', $type)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
        return $prefix . '-' . $mois . '-' . str_pad($dernier + 1, 4, '0', STR_PAD_LEFT);
    }
}