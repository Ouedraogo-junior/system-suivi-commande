<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Transaction;
use Illuminate\Http\Request;

class StatistiquesController extends Controller
{
    public function annuelles(Request $request)
    {
        $annee = $request->get('annee', now()->year);

        // ── Stats financières 12 mois ──────────────────────
        $parMois = [];
        for ($mois = 1; $mois <= 12; $mois++) {
            $base = Transaction::where('statut_validation', 'VALIDE')
                ->whereYear('date_transaction', $annee)
                ->whereMonth('date_transaction', $mois);

            $entrees           = (clone $base)->where('type', 'ENTREE')->sum('montant');
            $sorties           = (clone $base)->where('type', 'SORTIE')->sum('montant');
            $entreesManuelles  = (clone $base)->where('type', 'ENTREE')->whereNull('versement_id')->sum('montant');
            $entreesVersements = (clone $base)->where('type', 'ENTREE')->whereNotNull('versement_id')->sum('montant');

            $date = \Carbon\Carbon::createFromDate($annee, $mois, 1);

            $parMois[] = [
                'mois'               => $date->locale('fr')->isoFormat('MMM'),
                'entrees'            => (float) $entrees,
                'entrees_manuelles'  => (float) $entreesManuelles,
                'entrees_versements' => (float) $entreesVersements,
                'sorties'            => (float) $sorties,
                'solde'              => (float) ($entrees - $sorties),
            ];
        }

        $totalEntrees           = array_sum(array_column($parMois, 'entrees'));
        $totalSorties           = array_sum(array_column($parMois, 'sorties'));
        $totalEntreesManuelles  = array_sum(array_column($parMois, 'entrees_manuelles'));
        $totalEntreesVersements = array_sum(array_column($parMois, 'entrees_versements'));

        // ── Stats commandes ────────────────────────────────
        $commandes = [
            'total'   => Commande::count(),
            'termine' => Commande::where('statut', 'TERMINE')->count(),
            'annule'  => Commande::where('statut', 'ANNULE')->count(),
            'nonPaye' => Commande::where('statut_paiement', 'NON_PAYE')->count(),
            'partiel' => Commande::where('statut_paiement', 'PARTIEL')->count(),
        ];

        return response()->json([
            'parMois'                => $parMois,
            'totalEntrees'           => $totalEntrees,
            'totalSorties'           => $totalSorties,
            'totalSolde'             => $totalEntrees - $totalSorties,
            'totalEntreesManuelles'  => $totalEntreesManuelles,
            'totalEntreesVersements' => $totalEntreesVersements,
            'commandes'              => $commandes,
        ]);
    }
}