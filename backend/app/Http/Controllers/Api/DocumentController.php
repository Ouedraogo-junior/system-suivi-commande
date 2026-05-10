<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * GET /api/commandes/{id}/documents
     * Liste les documents générés pour une commande
     */
    public function index(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        return response()->json(
            $commande->documents()->latest()->get()
        );
    }

    /**
     * POST /api/commandes/{id}/documents/proforma
     * Génère et retourne le PDF pro forma
     */
    public function proforma(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        $data = $request->validate([
            'remise_taux'      => 'nullable|numeric|min:0|max:100',
            'delai_livraison'  => 'nullable|string|max:100',
            'acompte_taux'     => 'nullable|numeric|min:0|max:100',
            'acompte_montant'  => 'nullable|numeric|min:0',
        ]);

        $commande->load(['client', 'lignes', 'agent']);

        // Calculs
        $calculs = $this->calculer($commande, $data);

        // Référence document
        // $reference = $this->genererReferenceDocument($commande, 'PRO_FORMA');

        // Enregistrer en base
        $existant = Document::where('commande_id', $commande->id)
            ->where('type', 'PRO_FORMA') // ou 'FACTURE'
            ->first();

        if (!$existant) {
            $reference = $this->genererReferenceDocument($commande, 'PRO_FORMA');
            $document  = Document::create([
                'commande_id'    => $commande->id,
                'agent_id'       => $request->user()->id,
                'type'           => 'PRO_FORMA',
                'reference'      => $reference,
                'chemin_fichier' => '',
            ]);
        } else {
            $document  = $existant;
            $reference = $existant->reference;
        }

        // Générer PDF
        $pdf = Pdf::loadView('documents.proforma', [
            'commande'  => $commande,
            'calculs'   => $calculs,
            'reference' => $reference,
            'delai'     => $data['delai_livraison'] ?? null,
            'document'  => $document,
        ])->setPaper('a4', 'portrait');

        // Sauvegarder
        $chemin = "documents/{$reference}.pdf";
        Storage::put($chemin, $pdf->output());

        $document->update(['chemin_fichier' => $chemin]);

        return $pdf->stream("{$reference}.pdf");
    }

    /**
     * POST /api/commandes/{id}/documents/facture
     * Génère et retourne le PDF facture définitive
     */
    public function facture(Request $request, Commande $commande)
    {
        $this->authorizeCommande($request, $commande);

        $data = $request->validate([
            'remise_taux' => 'nullable|numeric|min:0|max:100',
        ]);

        $commande->load(['client', 'lignes', 'versements', 'agent']);

        $calculs = $this->calculer($commande, $data);

        $reference = $this->genererReferenceDocument($commande, 'FACTURE');

        $existant = Document::where('commande_id', $commande->id)
            ->where('type', 'FACTURE') // ou 'PRO_FORMA'
            ->first();

        if (!$existant) {
            $reference = $this->genererReferenceDocument($commande, 'FACTURE');
            $document  = Document::create([
                'commande_id'    => $commande->id,
                'agent_id'       => $request->user()->id,
                'type'           => 'FACTURE',
                'reference'      => $reference,
                'chemin_fichier' => '',
            ]);
        } else {
            $document  = $existant;
            $reference = $existant->reference;
        }

        $pdf = Pdf::loadView('documents.facture', [
            'commande'  => $commande,
            'calculs'   => $calculs,
            'reference' => $reference,
            'document'  => $document,
        ])->setPaper('a4', 'portrait');

        $chemin = "documents/{$reference}.pdf";
        Storage::put($chemin, $pdf->output());

        $document->update(['chemin_fichier' => $chemin]);

        return $pdf->stream("{$reference}.pdf");
    }

    /**
     * GET /api/commandes/{id}/documents/{docId}/telecharger
     * Retélécharger un document déjà généré
     */
    public function telecharger(Request $request, Commande $commande, Document $document)
    {
        $this->authorizeCommande($request, $commande);

        if ($document->commande_id !== $commande->id) {
            abort(404);
        }

        if (!Storage::exists($document->chemin_fichier)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        return Storage::download($document->chemin_fichier, "{$document->reference}.pdf");
    }

    // ── Helpers ────────────────────────────────────────────

    private function calculer(Commande $commande, array $data): array
    {
        $montantBrut = $commande->lignes->sum('sous_total');

        $remiseTaux   = $data['remise_taux'] ?? $commande->remise ?? 0;
        $montantRemise = $montantBrut * ($remiseTaux / 100);
        $montantNetHT  = $montantBrut - $montantRemise;

        $tvaTaux    = 18;
        $tvaMontant = $montantNetHT * ($tvaTaux / 100);
        $totalTTC   = $montantNetHT + $tvaMontant;

        // Acompte (pro forma uniquement)
        $acompteMontant = 0;
        if (isset($data['acompte_montant']) && $data['acompte_montant'] > 0) {
            $acompteMontant = $data['acompte_montant'];
        } elseif (isset($data['acompte_taux']) && $data['acompte_taux'] > 0) {
            $acompteMontant = $totalTTC * ($data['acompte_taux'] / 100);
        }

        // Versements (facture)
        $totalVerse   = $commande->versements ? $commande->versements->sum('montant') : 0;
        $soldeRestant = $totalTTC - $totalVerse;

        return [
            'montant_brut'    => $montantBrut,
            'remise_taux'     => $remiseTaux,
            'montant_remise'  => $montantRemise,
            'montant_net_ht'  => $montantNetHT,
            'tva_taux'        => $tvaTaux,
            'tva_montant'     => $tvaMontant,
            'total_ttc'       => $totalTTC,
            'acompte_montant' => $acompteMontant,
            'reste_a_payer'   => $totalTTC - $acompteMontant,
            'total_verse'     => $totalVerse,
            'solde_restant'   => $soldeRestant,
        ];
    }

    private function genererReferenceDocument(Commande $commande, string $type): string
    {
        $prefixes = [
            'IMPRIMERIE'  => 'IMP',
            'INFORMATIQUE'=> 'INFO',
            'NEGOCE'      => 'NEG',
            'AMENAGEMENT' => 'AME',
        ];

        $prefix = $prefixes[$commande->service] ?? 'DOC';
        $mois   = strtoupper(now()->locale('fr')->isoFormat('MMM'));
        $annee  = now()->year;

        // Compter tous les documents du même type+service+mois, pas seulement via commande
        $count = Document::where('type', $type)
            ->whereYear('created_at', $annee)
            ->whereMonth('created_at', now()->month)
            ->whereHas('commande', fn($q) => $q->where('service', $commande->service))
            ->count();

        // Boucler jusqu'à trouver une référence disponible
        do {
            $count++;
            $numero    = str_pad($count, 4, '0', STR_PAD_LEFT);
            $reference = "{$prefix}-{$mois}-{$numero}";
        } while (Document::where('reference', $reference)->exists());

        return $reference;
    }

    private function authorizeCommande(Request $request, Commande $commande): void
    {
        if ($request->user()->isAgent() && $commande->agent_id !== $request->user()->id) {
            abort(403, 'Accès refusé.');
        }
    }
}