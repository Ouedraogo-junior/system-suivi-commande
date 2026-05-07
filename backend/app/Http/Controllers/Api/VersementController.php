<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
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
                'commande_id'      => $commande->id,
                'agent_id'         => $request->user()->id,
                'numero_versement' => $numero,
                'montant'          => $data['montant'],
                'date_versement'   => $data['date_versement'],
                'reference'        => $data['reference'] ?? null,
                'notes'            => $data['notes'] ?? null,
                'statut_validation'=> 'VALIDE', // auto-validé pour l'instant
            ]);

            $commande->recalculerMontantPaye();
        });

        return response()->json(
            $versement->load('agent'),
            201
        );
    }

    // DELETE /api/commandes/{commande}/versements/{versement}
    public function destroy(Request $request, Commande $commande, Versement $versement)
    {
        // Seul un admin peut supprimer un versement
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($versement->commande_id !== $commande->id) {
            return response()->json(['message' => 'Versement introuvable.'], 404);
        }

        DB::transaction(function () use ($commande, $versement) {
            $versement->delete();
            $commande->recalculerMontantPaye();

            // Renuméroter les versements restants
            $commande->versements()
                ->orderBy('created_at')
                ->get()
                ->each(function ($v, $index) {
                    $v->update(['numero_versement' => $index + 1]);
                });
        });

        return response()->json(null, 204);
    }

    // ── Helper ─────────────────────────────────────────────

    private function authorizeAcces(Request $request, Commande $commande): void
    {
        if ($request->user()->isAgent() && $commande->agent_id !== $request->user()->id) {
            abort(403, 'Accès refusé.');
        }
    }
}