<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Facture {{ $reference }}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DejaVu Sans', sans-serif; font-size: 10pt; color: #1a1a1a; }

/* ── HEADER LOGO ── */
.logo-wrap img { width: 100%; max-height: 60px; object-fit: contain; }
.logo-fallback { font-size: 15pt; font-weight: bold; color: #1a5c2a; letter-spacing: 2px; }
.logo-fallback-sub { font-size: 8pt; color: #888; }

/* ── TITRE ── */
.titre-bar { width: 100%; background: #1a5c2a; margin-bottom: 8px; }

/* ── META ── */
.meta-table { width: 100%; margin-bottom: 8px; }
.bloc-label {
  font-size: 8.5pt; font-weight: bold; color: #1a5c2a;
  text-transform: uppercase; letter-spacing: 0.8px;
  border-bottom: 1px solid #c8a84b; padding-bottom: 1px;
  margin-bottom: 3px; display: block;
}
.bloc-val { font-size: 9.5pt; line-height: 1.5; color: #222; }

.badge { padding: 1px 6px; border-radius: 8px; font-size: 8.5pt; font-weight: bold; }
.badge-paye    { background: #d4edda; color: #155724; }
.badge-partiel { background: #fff3cd; color: #856404; }
.badge-non     { background: #f8d7da; color: #721c24; }

/* ── TABLEAU LIGNES ── */
.tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.tbl thead tr { background: #1a5c2a; }
.tbl thead th { color: #fff; padding: 5px 6px; font-size: 9.5pt; font-weight: bold; text-align: left; }
.tbl thead th.r { text-align: right; }
.tbl thead th.c { text-align: center; }
.tbl tbody tr { border-bottom: 1px solid #e8e8e8; }
.tbl tbody tr.alt { background: #f8f6f0; }
.tbl tbody td { padding: 4px 6px; font-size: 9.5pt; }
.tbl tbody td.r { text-align: right; }
.tbl tbody td.c { text-align: center; color: #999; font-size: 9pt; }

/* ── CALCULS ── */
.calc-tbl { width: 46%; border-collapse: collapse; margin-left: auto; margin-bottom: 8px; }
.calc-tbl td { padding: 3px 8px; font-size: 9.5pt; border-bottom: 1px solid #eee; }
.calc-tbl td.lbl { color: #1a5c2a; }
.calc-tbl td.val { text-align: right; font-weight: bold; }
.r-ttc td { background: #1a5c2a; color: #fff; font-size: 11pt; font-weight: bold; padding: 5px 8px; border: none; }
.r-ttc td.val { color: #ffffff; }
.r-ttc td.lbl { color: #ffffff; }

/* ── VERSEMENTS ── */
.section-lbl {
  font-size: 9pt; font-weight: bold; color: #1a5c2a;
  text-transform: uppercase; letter-spacing: 0.8px;
  border-bottom: 1.5px solid #1a5c2a; padding-bottom: 2px;
  margin-bottom: 5px; display: block;
}
.vers-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.vers-tbl thead tr { background: #f0f7f2; }
.vers-tbl thead th {
  padding: 4px 6px; font-size: 9pt; color: #1a5c2a;
  text-align: left; border-bottom: 1px solid #c8a84b; font-weight: bold;
}
.vers-tbl thead th.r { text-align: right; }
.vers-tbl tbody td { padding: 4px 6px; font-size: 9.5pt; border-bottom: 1px solid #eee; }
.vers-tbl tbody td.r { text-align: right; }
.vers-tbl tfoot td {
  padding: 4px 6px; font-size: 10pt; font-weight: bold;
  background: #f0f7f2; color: #1a5c2a; border-top: 1.5px solid #1a5c2a;
}
.vers-tbl tfoot td.r { text-align: right; }

/* ── SOLDE ── */
.solde-tbl { width: 46%; border-collapse: collapse; margin-left: auto; margin-bottom: 10px; }
.solde-tbl td { padding: 3px 8px; font-size: 9.5pt; border-bottom: 1px solid #eee; }
.solde-tbl td.lbl { color: #1a5c2a; }
.solde-tbl td.val { text-align: right; font-weight: bold; }
.r-solde td { background: #fdf8ee; }
.r-solde td.val { color: #000000; font-size: 11pt; }
.r-solde-ok td { background: #f0f7f2; }
.r-solde-ok td.val { color: #1a5c2a; font-size: 11pt; }

/* ── SIGNATURES ── */
.sig-fixed {
  position: fixed;
  bottom: 0mm;
  left: 0mm;
  width: 100%;
}
.sig-tbl { width: 100%; }

</style>
</head>
<body>
<div>

  <!-- HEADER LOGO -->
  {{-- <div class="logo-wrap">
    @if(file_exists(public_path('images/logo.png')))
      <img src="{{ public_path('images/logo.png') }}" alt="SOGECOP">
    @else
      <div class="logo-fallback">SOGECOP</div>
      <div class="logo-fallback-sub">Société Générale de Commerce et de Prestations</div>
    @endif
  </div> --}}

  <!-- TITRE -->
  <table class="titre-bar" cellpadding="0" cellspacing="0">
    <tr>
      <td style="text-align:center; padding:6px 0 4px;">
        <span style="font-size:14pt; font-weight:bold; letter-spacing:2px; color:#fff;">FACTURE DÉFINITIVE {{ $reference }}</span><br>
        <span style="color:#fff; font-size:9pt;">
          {{-- {{ $reference }} &nbsp;|&nbsp;  --}}
          Émis le {{ now()->locale('fr')->isoFormat('D MMMM YYYY') }}
        </span>
      </td>
    </tr>
  </table>

  <!-- META -->
  <table class="meta-table" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:50%; vertical-align:top; padding-right:16px;">
        <span class="bloc-label">DOIT</span>
        <div class="bloc-val">
          <strong>{{ $commande->client->nom_complet }}</strong><br>
          @if($commande->client->organisation){{ $commande->client->organisation }}<br>@endif
          @if($commande->client->telephone)Tél : {{ $commande->client->telephone }}<br>@endif
          @if($commande->client->email){{ $commande->client->email }}@endif
        </div>
      </td>
      <td style="width:50%; vertical-align:top; text-align:right;">
        <span class="bloc-label">Détails commande</span>
        <div class="bloc-val">
          Réf. commande : <strong>{{ $commande->reference }}</strong><br>
          Service : <strong>{{ ucfirst(strtolower($commande->service)) }}</strong><br>
          @if(!empty($commande->agent))
            Agent : {{ $commande->agent->nom_complet ?? '' }}<br>
          @endif
          @if($commande->date_echeance)
            Échéance : <strong>{{ \Carbon\Carbon::parse($commande->date_echeance)->locale('fr')->isoFormat('D MMM YYYY') }}</strong><br>
          @endif
          Statut :
          @if($commande->statut_paiement === 'PAYE')
            <span class="badge badge-paye">Soldée</span>
          @elseif($commande->statut_paiement === 'PARTIEL')
            <span class="badge badge-partiel">Partiel</span>
          @else
            <span class="badge badge-non">Non payée</span>
          @endif
        </div>
      </td>
    </tr>
  </table>

  <!-- LIGNES -->
  <table class="tbl" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th class="c" style="width:24px;">#</th>
        <th>Désignation</th>
        <th class="r" style="width:55px;">Qté</th>
        <th class="r" style="width:100px;">Prix unitaire</th>
        <th class="r" style="width:105px;">Sous-total</th>
      </tr>
    </thead>
    <tbody>
      @foreach($commande->lignes->sortBy('ordre') as $i => $ligne)
      <tr class="{{ $i % 2 === 1 ? 'alt' : '' }}">
        <td class="c">{{ $i + 1 }}</td>
        <td>{{ $ligne->designation }}</td>
        <td class="r">{{ number_format($ligne->quantite, 0, ',', ' ') }}</td>
        <td class="r">{{ number_format($ligne->prix_unitaire, 0, ',', ' ') }} F</td>
        <td class="r">{{ number_format($ligne->sous_total, 0, ',', ' ') }} F</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <!-- CALCULS -->
  <table class="calc-tbl" cellpadding="0" cellspacing="0">
    <tr>
      <td class="lbl">Montant brut</td>
      <td class="val">{{ number_format($calculs['montant_brut'], 0, ',', ' ') }} F</td>
    </tr>
    @if($calculs['montant_remise'] > 0)
    <tr>
        <td class="lbl">Remise</td>
        <td class="val" style="color:#c0392b;">
            − {{ number_format($calculs['montant_remise'], 0, ',', ' ') }} F
        </td>
    </tr>
    @endif
    <tr>
      <td class="lbl">Montant net HT</td>
      <td class="val">{{ number_format($calculs['montant_net_ht'], 0, ',', ' ') }} F</td>
    </tr>
    @if($calculs['tva_applicable'])
    <tr>
      <td class="lbl">TVA ({{ $calculs['tva_taux'] }}%)</td>
      <td class="val">{{ number_format($calculs['tva_montant'], 0, ',', ' ') }} F</td>
    </tr>
    @endif
    <tr class="r-ttc">
      <td class="lbl">TOTAL {{ $calculs['tva_applicable'] ? 'TTC' : 'HT' }}</td>
      <td class="val">{{ number_format($calculs['total_ttc'], 0, ',', ' ') }} F CFA</td>
    </tr>
  </table>

  <!-- VERSEMENTS -->
  @if($commande->versements->count() > 0)
  <span class="section-lbl">Historique des versements</span>
  <table class="vers-tbl" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th style="width:110px;">Versement</th>
        <th style="width:90px;">Date</th>
        <th>Référence</th>
        <th class="r" style="width:110px;">Montant</th>
      </tr>
    </thead>
    <tbody>
      @foreach($commande->versements->sortBy('numero_versement') as $v)
      <tr>
        <td style="color:#1a5c2a; font-weight:bold;">Versement {{ $v->numero_versement }}</td>
        <td>{{ \Carbon\Carbon::parse($v->date_versement)->locale('fr')->isoFormat('D MMM YYYY') }}</td>
        <td style="color:#666;">{{ $v->reference ?? '—' }}</td>
        <td class="r">{{ number_format($v->montant, 0, ',', ' ') }} F</td>
      </tr>
      @endforeach
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">Total versé</td>
        <td class="r">{{ number_format($calculs['total_verse'], 0, ',', ' ') }} F CFA</td>
      </tr>
    </tfoot>
  </table>

  <!-- SOLDE -->
  <table class="solde-tbl" cellpadding="0" cellspacing="0">
    <tr>
      <td class="lbl">Total {{ $calculs['tva_applicable'] ? 'TTC' : 'HT' }}</td>
      <td class="val">{{ number_format($calculs['total_ttc'], 0, ',', ' ') }} F</td>
    </tr>
    <tr>
      <td class="lbl">Total versé</td>
      <td class="val" style="color:#1a5c2a;">− {{ number_format($calculs['total_verse'], 0, ',', ' ') }} F</td>
    </tr>
    @if($calculs['solde_restant'] <= 0)
    <tr class="r-solde-ok">
      <td class="lbl">Solde restant dû</td>
      <td class="val">Soldée ✓</td>
    </tr>
    @else
    <tr class="r-solde">
      <td class="lbl">Solde restant dû</td>
      <td class="val">{{ number_format($calculs['solde_restant'], 0, ',', ' ') }} F CFA</td>
    </tr>
    @endif
  </table>

  @else
  <table style="width:100%; margin-bottom:8px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:8px 10px; background:#f8f6f0; border-left:2px solid #c8a84b; font-size:7.5pt; color:#666;">
        Aucun versement enregistré.
      </td>
    </tr>
  </table>
  @endif

  <!-- SIGNATURES (Rendu par le controller) -->

</div>
</body>
</html>