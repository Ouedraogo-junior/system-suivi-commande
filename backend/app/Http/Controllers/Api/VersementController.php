<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Transaction;
use App\Models\Versement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VersementController extends Controller
{
    // GET /api/commandes/{commande}/versements
    public function index(Request $request, Commande $commande)
    {
        $this->authorizeAcces($request, $commande);

        $versements = $commande->versements()
            ->with(['agent', 'validePar'])
            ->orderBy('created_at')
            ->get();

        return response()->json($versements);
    }

    // POST /api/commandes/{commande}/versements
    public function store(Request $request, Commande $commande)
    {
        $this->authorizeAcces($request, $commande);

        if ($commande->statut === 'ANNULE') {
            return response()->json([
                'message' => 'Impossible d\'ajouter un versement sur une commande annulée.',
            ], 422);
        }

        $data = $request->validate([
            'montant'        => 'required|numeric|min:1',
            'date_versement' => 'required|date',
            'reference'      => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        DB::transaction(function () use ($data, $request, $commande, &$versement) {
            $numero = $commande->versements()->count() + 1;

            $versement = Versement::create([
                'commande_id'       => $commande->id,
                'agent_id'          => $request->user()->id,
                'numero_versement'  => $numero,
                'montant'           => $data['montant'],
                'date_versement'    => $data['date_versement'],
                'reference'         => $data['reference'] ?? null,
                'notes'             => $data['notes'] ?? null,
                'statut_validation' => 'VALIDE',
            ]);

            $commande->recalculerMontantPaye();

            Transaction::create([
                'reference'         => $this->genererReference(),
                'type'              => 'ENTREE',
                'categorie'         => 'Paiement client',
                'montant'           => $data['montant'],
                'date_transaction'  => $data['date_versement'],
                'commande_id'       => $commande->id,
                'versement_id'      => $versement->id,
                'agent_id'          => $request->user()->id,
                'statut_validation' => 'VALIDE',
                'description'       => 'Versement #' . $numero . ' — Commande ' . $commande->reference,
            ]);
        });

        return response()->json($versement->load('agent'), 201);
    }

    // PUT /api/commandes/{commande}/versements/{versement}
    public function update(Request $request, Commande $commande, Versement $versement)
    {
        $user = $request->user();

        if (!$user->isAdmin() && $versement->agent_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($versement->commande_id !== $commande->id) {
            return response()->json(['message' => 'Versement introuvable.'], 404);
        }

        $data = $request->validate([
            'montant'   => 'required|numeric|min:1',
            'reference' => 'nullable|string|max:100',
            'notes'     => 'nullable|string',
        ]);

        DB::transaction(function () use ($data, $request, $commande, $versement) {
            $versement->update($data);

            $commande->recalculerMontantPaye();

            $transaction = Transaction::where('versement_id', $versement->id)->first();
            if ($transaction) {
                $transaction->update([
                    'montant'     => $data['montant'],
                    'modifie_par' => $request->user()->id,
                    'modifie_le'  => now(),
                ]);
            }
        });

        return response()->json($versement->fresh()->load('agent'));
    }

    // DELETE /api/commandes/{commande}/versements/{versement}
    public function destroy(Request $request, Commande $commande, Versement $versement)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($versement->commande_id !== $commande->id) {
            return response()->json(['message' => 'Versement introuvable.'], 404);
        }

        DB::transaction(function () use ($request, $commande, $versement) {
            // Annuler la transaction liée avec traçabilité
            Transaction::where('versement_id', $versement->id)
                ->first()
                ?->update([
                    'statut_validation' => 'ANNULEE',
                    'modifie_par'       => $request->user()->id,
                    'modifie_le'        => now(),
                ]);

            $versement->delete();
            $commande->recalculerMontantPaye();

            // Renuméroter les versements restants
            $commande->versements()
                ->orderBy('created_at')
                ->get()
                ->each(fn($v, $i) => $v->update(['numero_versement' => $i + 1]));
        });

        return response()->json(null, 204);
    }

    // ── Helpers ────────────────────────────────────────────

    private function genererReference(): string
    {
        $mois = strtoupper(now()->locale('fr')->isoFormat('MMM'));
        $dernier = Transaction::where('type', 'ENTREE')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
        return 'ENT-' . $mois . '-' . str_pad($dernier + 1, 4, '0', STR_PAD_LEFT);
    }

    private function authorizeAcces(Request $request, Commande $commande): void
    {
        if ($request->user()->isAgent() && $commande->agent_id !== $request->user()->id) {
            abort(403, 'Accès refusé.');
        }
    }
}