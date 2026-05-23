<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Document;
use Mpdf\Mpdf;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
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
            'conditions'       => 'nullable|string|max:2000',  
            'validite'         => 'nullable|string|max:100',   

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
        $html = view('documents.proforma', [
            'commande'  => $commande,
            'calculs'   => $calculs,
            'reference' => $reference,
            'delai'     => $data['delai_livraison'] ?? null,
            'conditions' => $data['conditions'] ?? null,
            'validite' => $data['validite'] ?? null,
            'document'  => $document,
        ])->render();

        $mpdf = new Mpdf([
            'mode'              => 'utf-8',
            'format'            => 'A4',
            'margin_top'        => 30,
            'margin_bottom'     => 20,
            'margin_left'       => 12,
            'margin_right'      => 12,
            'margin_header'     => 5,
            'margin_footer'     => 5,
        ]);

        $mpdf->SetHTMLHeader($this->buildHeader($commande));
        $mpdf->SetHTMLFooter($this->buildFooter());
        $mpdf->WriteHTML($html);

        $chemin = "documents/{$reference}.pdf";
        Storage::put($chemin, $mpdf->Output('', 'S'));
        $document->update(['chemin_fichier' => $chemin]);

        return response($mpdf->Output('', 'S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "inline; filename=\"{$reference}.pdf\"");
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

        $existant = Document::where('commande_id', $commande->id)
            ->where('type', 'FACTURE')
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

        $html = view('documents.facture', [
            'commande'  => $commande,
            'calculs'   => $calculs,
            'reference' => $reference,
            'document'  => $document,
        ])->render();

        $mpdf = new Mpdf([
            'mode'              => 'utf-8',
            'format'            => 'A4',
            'margin_top'        => 30,
            'margin_bottom'     => 20,
            'margin_left'       => 12,
            'margin_right'      => 12,
            'margin_header'     => 5,
            'margin_footer'     => 5,
        ]);

        $mpdf->SetHTMLHeader($this->buildHeader($commande));
        $mpdf->SetHTMLFooter($this->buildFooter());
        $mpdf->WriteHTML($html);

        $chemin = "documents/{$reference}.pdf";
        Storage::put($chemin, $mpdf->Output('', 'S'));
        $document->update(['chemin_fichier' => $chemin]);

        return response($mpdf->Output('', 'S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "inline; filename=\"{$reference}.pdf\"");
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
        $montantBrut   = $commande->lignes->sum('sous_total');
        $remiseTaux    = $data['remise_taux'] ?? $commande->remise ?? 0;
        $montantRemise = $montantBrut * ($remiseTaux / 100);
        $montantNetHT  = $montantBrut - $montantRemise;

        // ── TVA : lire tva_applicable et tva_taux depuis la commande ──
        $tvaTaux    = $commande->tva_applicable ? (float) ($commande->tva_taux ?? 18) : 0;
        $tvaMontant = $montantNetHT * ($tvaTaux / 100);
        $totalTTC   = $montantNetHT + $tvaMontant;

        // Acompte
        $acompteMontant = 0;
        if (isset($data['acompte_montant']) && $data['acompte_montant'] > 0) {
            $acompteMontant = $data['acompte_montant'];
        } elseif (isset($data['acompte_taux']) && $data['acompte_taux'] > 0) {
            $acompteMontant = $totalTTC * ($data['acompte_taux'] / 100);
        }

        $totalVerse   = $commande->versements?->sum('montant') ?? 0;
        $soldeRestant = $totalTTC - $totalVerse;

        return [
            'montant_brut'      => $montantBrut,
            'remise_taux'       => $remiseTaux,
            'montant_remise'    => $montantRemise,
            'montant_net_ht'    => $montantNetHT,
            'tva_applicable'    => $commande->tva_applicable, // ← passer aux blades
            'tva_taux'          => $tvaTaux,
            'tva_montant'       => $tvaMontant,
            'total_ttc'         => $totalTTC,
            'acompte_montant'   => $acompteMontant,
            'reste_a_payer'     => $totalTTC - $acompteMontant,
            'total_verse'       => $totalVerse,
            'solde_restant'     => $soldeRestant,
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

    private function buildHeader(Commande $commande): string
    {
        $logoPath = public_path('images/logo_large.png');
    
        if (file_exists($logoPath)) {
            $logoHtml = '<img src="' . $logoPath . '" style="width:300%; max-height:90px; object-fit:contain;">';
        } else {
            $logoHtml = '
                <div style="font-size:13pt; font-weight:bold; color:#1a5c2a; letter-spacing:2px;">SOGECOP</div>
                <div style="font-size:6pt; color:#888;">Société Générale de Commerce et de Prestations</div>';
        }
    
        return '
        <div style="
            width: 300%;
            text-align: center;
            border-bottom: 2px solid #1a5c2a;
            padding-bottom: 6px;
            margin-bottom: 8px;
        ">
            ' . $logoHtml . '
        </div>';
    }


    private function buildFooter(): string
    {
        return '
        <div style="background:#1a5c2a; color:#fff; text-align:center; padding:4px 8px; font-size:6.5pt; line-height:1.5; border-top:2px solid #c8a84b;">
        Adresse : Rue du 17 Octobre, Bld Muammar Kaddafi, 11 BP 268 OUAGA 11, Ouaga 2000, Burkina Faso
        &nbsp;|&nbsp; Tél : (+226) 55 08 86 36 / 70 51 13 84
        &nbsp;|&nbsp; <span style="color:#c8a84b;">sogecop.sarl.bf@gmail.com</span>
        &nbsp;|&nbsp; RCCM : BF-OUA-01-2023-B12-04313 | IFU : 00200104U
        &nbsp;|&nbsp; Page {PAGENO} / {nbpg}
        </div>';
    }
}