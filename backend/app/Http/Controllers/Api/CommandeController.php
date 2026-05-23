<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\HistoriqueCommande;
use App\Models\LigneCommande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    // GET /api/commandes
    public function index(Request $request)
    {
        $query = Commande::with(['client', 'agent'])
            ->orderBy('created_at', 'desc');

        // Filtres
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('statut_paiement')) {
            $query->where('statut_paiement', $request->statut_paiement);
        }
        if ($request->filled('service')) {
            $query->where('service', $request->service);
        }
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($q2) use ($q) {
                $q2->where('reference', 'like', "%$q%")
                   ->orWhereHas('client', fn($c) => $c->where('nom_complet', 'like', "%$q%"));
            });
        }


        $perPage = min((int) $request->get('per_page', 20), 100);

        return response()->json($query->paginate($perPage));
    }

    // GET /api/commandes/{id}
    public function show(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        $commande->load([
            'client',
            'agent',
            'lignes',
            'versements.agent',
            'documents',
            'historique.agent',
        ]);

        return response()->json($commande);
    }

    // POST /api/commandes
    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id'      => 'required|exists:clients,id',
            'service'        => 'required|in:IMPRIMERIE,INFORMATIQUE,NEGOCE,AMENAGEMENT',
            'remise'         => 'nullable|numeric|min:0|max:100',
            'tva_applicable' => 'boolean', 
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'date_echeance'  => 'nullable|date',
            'notes'          => 'nullable|string',
            'lignes'         => 'required|array|min:1',
            'lignes.*.designation'  => 'required|string|max:255',
            'lignes.*.quantite'     => 'required|numeric|min:0.01',
            'lignes.*.prix_unitaire'=> 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data, $request, &$commande) {
            $commande = Commande::create([
                'reference'      => $this->genererReference($data['service']),
                'client_id'      => $data['client_id'],
                'agent_id'       => $request->user()->id,
                'service'        => $data['service'],
                'statut'         => 'EN_ATTENTE',
                'statut_paiement'=> 'NON_PAYE',
                'remise'         => $data['remise'] ?? 0,
                'tva_applicable' => $data['tva_applicable'] ?? false,
                'tva_taux' => $data['tva_taux'] ?? 18.00,
                'date_echeance'  => $data['date_echeance'] ?? null,
                'notes'          => $data['notes'] ?? null,
                'montant_total'  => 0,
                'montant_paye'   => 0,
            ]);

            foreach ($data['lignes'] as $index => $ligne) {
                LigneCommande::create([
                    'commande_id'   => $commande->id,
                    'designation'   => $ligne['designation'],
                    'quantite'      => $ligne['quantite'],
                    'prix_unitaire' => $ligne['prix_unitaire'],
                    'sous_total'    => $ligne['quantite'] * $ligne['prix_unitaire'],
                    'ordre'         => $index + 1,
                ]);
            }

            $commande->recalculerMontantTotal();

            HistoriqueCommande::create([
                'commande_id'   => $commande->id,
                'agent_id'      => $request->user()->id,
                'ancien_statut' => null,
                'nouveau_statut'=> 'EN_ATTENTE',
                'commentaire'   => 'Commande créée.',
            ]);
        });

        return response()->json(
            $commande->load(['client', 'lignes']),
            201
        );
    }

    // PUT /api/commandes/{id}
    public function update(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        $data = $request->validate([
            'service'        => 'sometimes|in:IMPRIMERIE,INFORMATIQUE,NEGOCE,AMENAGEMENT',
            'remise'         => 'nullable|numeric|min:0|max:100',
            'tva_applicable' => 'boolean',
            'tva_taux' => 'nullable|numeric|min:0|max:100',
            'date_echeance'  => 'nullable|date',
            'notes'          => 'nullable|string',
            'lignes'         => 'sometimes|array|min:1',
            'lignes.*.id'           => 'nullable|exists:lignes_commande,id',
            'lignes.*.designation'  => 'required|string|max:255',
            'lignes.*.quantite'     => 'required|numeric|min:0.01',
            'lignes.*.prix_unitaire'=> 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data, $request, $commande) {
            $commande->update(collect($data)->except('lignes')->toArray());

            HistoriqueCommande::create([
                'commande_id'   => $commande->id,
                'agent_id'      => $request->user()->id,
                'ancien_statut' => $commande->statut,
                'nouveau_statut'=> $commande->statut,
                'commentaire'   => 'Commande modifiée par ' . $request->user()->nom_complet . '.',
            ]);

            if (isset($data['lignes'])) {
                // Supprimer les lignes retirées
                $idsGardes = collect($data['lignes'])->pluck('id')->filter()->toArray();
                $commande->lignes()->whereNotIn('id', $idsGardes)->delete();

                foreach ($data['lignes'] as $index => $ligne) {
                    LigneCommande::updateOrCreate(
                        ['id' => $ligne['id'] ?? null],
                        [
                            'commande_id'   => $commande->id,
                            'designation'   => $ligne['designation'],
                            'quantite'      => $ligne['quantite'],
                            'prix_unitaire' => $ligne['prix_unitaire'],
                            'sous_total'    => $ligne['quantite'] * $ligne['prix_unitaire'],
                            'ordre'         => $index + 1,
                        ]
                    );
                }

                $commande->recalculerMontantTotal();
            }
        });

        return response()->json(
            $commande->fresh(['client', 'lignes'])
        );
    }

    // PATCH /api/commandes/{id}/statut
    public function changerStatut(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        $data = $request->validate([
            'statut'      => 'required|in:EN_ATTENTE,EN_COURS,TERMINE,ANNULE',
            'commentaire' => 'nullable|string',
        ]);

        $ancienStatut = $commande->statut;

        DB::transaction(function () use ($data, $request, $commande, $ancienStatut) {
            $commande->update(['statut' => $data['statut']]);

            HistoriqueCommande::create([
                'commande_id'   => $commande->id,
                'agent_id'      => $request->user()->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut'=> $data['statut'],
                'commentaire'   => $data['commentaire'] ?? null,
            ]);
        });

        return response()->json($commande->fresh());
    }

    // DELETE /api/commandes/{id}
    public function destroy(Request $request, Commande $commande)
    {
        // Seul un admin peut supprimer
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $commande->delete();

        return response()->json(null, 204);
    }

    // ── Helpers ────────────────────────────────────────────

    // APRÈS
    private function authorizeCommande(Request $request, Commande $commande): void
    {
        // Toutes les commandes sont visibles et modifiables par tous les utilisateurs authentifiés
    }

    private function genererReference(string $service): string
    {
        $prefixes = [
            'IMPRIMERIE'  => 'IMP',
            'INFORMATIQUE'=> 'INFO',
            'NEGOCE'      => 'NEG',
            'AMENAGEMENT' => 'AME',
        ];

        $prefix = $prefixes[$service];
        $mois = strtoupper(now()->locale('fr')->isoFormat('MMM'));
        $annee  = now()->year;

        $dernierNumero = Commande::where('service', $service)
            ->whereYear('created_at', $annee)
            ->whereMonth('created_at', now()->month)
            ->count();

        $numero = str_pad($dernierNumero + 1, 3, '0', STR_PAD_LEFT);

        return "$prefix-$mois-$numero"; // ex: IMP-MAI-001
    }
}