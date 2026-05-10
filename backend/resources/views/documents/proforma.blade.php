<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Pro Forma {{ $reference }}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DejaVu Sans', sans-serif; font-size: 8pt; color: #1a1a1a; }

  /* ── HEADER RÉPÉTÉ SUR CHAQUE PAGE ── */
  .page-header {
    position: running(pageHeader);
  }
  @page {
    margin: 10mm 12mm 22mm 12mm;
    @top-center { content: element(pageHeader); }
  }

  /* ── FOOTER RÉPÉTÉ SUR CHAQUE PAGE ── */
  .page-footer {
    position: fixed;
    bottom: -18mm;
    left: 0; right: 0;
    background: #1a5c2a;
    color: #fff;
    text-align: center;
    padding: 4px 8px;
    font-size: 6.5pt;
    line-height: 1.5;
    border-top: 2px solid #c8a84b;
  }
  .page-footer span { color: #c8a84b; }

  /* Numéro de page */
  .page-num::after { content: counter(page); }
  .page-total::after { content: counter(pages); }

  /* ── HEADER CONTENU ── */
  .hdr-table { width: 100%; border-bottom: 2px solid #1a5c2a; padding-bottom: 6px; margin-bottom: 8px; }
  .logo-text  { font-size: 13pt; font-weight: bold; color: #1a5c2a; letter-spacing: 2px; }
  .logo-sub   { font-size: 6pt; color: #888; }
  .hdr-info   { text-align: right; font-size: 6.5pt; color: #444; line-height: 1.6; }
  .hdr-info strong { color: #1a5c2a; }

  /* ── TITRE ── */
  .titre-bar { width: 100%; background: #1a5c2a; margin-bottom: 8px; }

  /* ── META ── */
  .meta-table { width: 100%; margin-bottom: 8px; }
  .bloc-label {
    font-size: 6.5pt; font-weight: bold; color: #1a5c2a;
    text-transform: uppercase; letter-spacing: 0.8px;
    border-bottom: 1px solid #c8a84b; padding-bottom: 1px;
    margin-bottom: 3px; display: block;
  }
  .bloc-val { font-size: 7.5pt; line-height: 1.5; color: #222; }

  /* ── TABLEAU LIGNES ── */
  .tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .tbl thead tr { background: #1a5c2a; }
  .tbl thead th { color: #fff; padding: 5px 6px; font-size: 7.5pt; font-weight: bold; text-align: left; }
  .tbl thead th.r { text-align: right; }
  .tbl thead th.c { text-align: center; }
  .tbl tbody tr { border-bottom: 1px solid #e8e8e8; }
  .tbl tbody tr.alt { background: #f8f6f0; }
  .tbl tbody td { padding: 4px 6px; font-size: 7.5pt; }
  .tbl tbody td.r { text-align: right; }
  .tbl tbody td.c { text-align: center; color: #999; font-size: 7pt; }

  /* ── CALCULS ── */
  .calc-tbl { width: 46%; border-collapse: collapse; margin-left: auto; margin-bottom: 8px; }
  .calc-tbl td { padding: 3px 8px; font-size: 7.5pt; border-bottom: 1px solid #eee; }
  .calc-tbl td.lbl { color: #ffffff; }
  .calc-tbl td.val { text-align: right; font-weight: bold; }
  .r-ttc td { background: #1a5c2a; color: #fff; font-size: 9pt; font-weight: bold; padding: 5px 8px; border: none; }
  .r-ttc td.val { color: #c8a84b; }
  .r-ac td { background: #f0f7f2; }
  .r-rp td { background: #fdf8ee; }
  .r-rp td.val { color: #b8860b; font-weight: bold; }

  /* ── CONDITIONS ── */
  .cond-box {
    width: 100%; border-left: 2px solid #c8a84b;
    border-top: 1px solid #e0d5b0; border-right: 1px solid #e0d5b0; border-bottom: 1px solid #e0d5b0;
    padding: 6px 10px; margin-bottom: 10px;
    font-size: 7pt; color: #555; line-height: 1.6; background: #fdfaf4;
  }
  .cond-titre { font-weight: bold; color: #1a5c2a; font-size: 7.5pt; }

  /* ── SIGNATURES ── */
  .sig-tbl { width: 100%; margin-top: 16px; }
  .sig-label { font-size: 7pt; font-weight: bold; color: #1a5c2a; text-transform: uppercase; display: block; margin-bottom: 2px; }
  .sig-name  { font-size: 7.5pt; color: #333; display: block; margin-bottom: 24px; }
  .sig-line  { border-top: 1px solid #bbb; padding-top: 2px; font-size: 6.5pt; color: #999; width: 110px; display: block; }

  .content { padding: 0; }
</style>
</head>
<body>

  <!-- FOOTER FIXE (répété chaque page) -->
  <div class="page-footer">
    Adresse : Rue du 17 Octobre, Bld Muammar Kaddafi, 11 BP 268 OUAGA 11, Ouaga 2000, Burkina Faso
    &nbsp;|&nbsp; Tél : (+226) 55 08 86 36 / 70 51 13 84
    &nbsp;|&nbsp; <span>sogecop.sarl.bf@gmail.com</span>
    &nbsp;|&nbsp; RCCM : BF-OUA-01-2023-B12-04313 | IFU : 00200104U
    &nbsp;|&nbsp; Page <span class="page-num"></span> / <span class="page-total"></span>
  </div>

<div style="padding: 8mm 12mm 22mm 12mm;">

  <!-- HEADER -->
  <table class="hdr-table" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:55%; vertical-align:middle;">
        @if(file_exists(public_path('images/logo_sogecop.png')))
          <img src="{{ public_path('images/logo_sogecop.png') }}" alt="SOGECOP" style="width:110px;">
        @else
          <div class="logo-text">SOGECOP</div>
          <div class="logo-sub">Société Générale de Commerce et de Prestations</div>
        @endif
      </td>
      <td style="width:45%; vertical-align:middle;">
        <div class="hdr-info">
          <strong>SOGECOP Sarl</strong><br>
          Rue du 17 Octobre, Bld Muammar Kaddafi<br>
          11 BP 268 OUAGA 11, Ouaga 2000 — Burkina Faso<br>
          Tél : (+226) 55 08 86 36 / 70 51 13 84<br>
          sogecop.sarl.bf@gmail.com | RCCM : BF-OUA-01-2023-B12-04313
        </div>
      </td>
    </tr>
  </table>

  <!-- TITRE -->
  <table class="titre-bar" cellpadding="0" cellspacing="0">
    <tr>
      <td style="text-align:center; padding:6px 0 4px;">
        <span style="font-size:12pt; font-weight:bold; letter-spacing:2px; color:#fff;">PRO FORMA</span><br>
        <span style="color:#c8a84b; font-size:7pt;">
          {{ $reference }} &nbsp;|&nbsp; Émis le {{ now()->locale('fr')->isoFormat('D MMMM YYYY') }}
        </span>
      </td>
    </tr>
  </table>

  <!-- META -->
  <table class="meta-table" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:50%; vertical-align:top; padding-right:16px;">
        <span class="bloc-label">Destinataire</span>
        <div class="bloc-val">
          <strong>{{ $commande->client->nom_complet }}</strong><br>
          @if($commande->client->organisation){{ $commande->client->organisation }}<br>@endif
          @if($commande->client->telephone)Tél : {{ $commande->client->telephone }}<br>@endif
          @if($commande->client->email){{ $commande->client->email }}@endif
        </div>
      </td>
      <td style="width:50%; vertical-align:top; text-align:right;">
        <span class="bloc-label">Informations</span>
        <div class="bloc-val">
          Réf. commande : <strong>{{ $commande->reference }}</strong><br>
          Service : <strong>{{ ucfirst(strtolower($commande->service)) }}</strong><br>
          @if(!empty($commande->agent))
            Agent : {{ $commande->agent->nom_complet ?? '' }} <br>
          @endif
          @if($delai)Délai : <strong>{{ $delai }}</strong><br>@endif
          @if($commande->date_echeance)
            Échéance : {{ \Carbon\Carbon::parse($commande->date_echeance)->locale('fr')->isoFormat('D MMM YYYY') }}
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
    @if($calculs['remise_taux'] > 0)
    <tr>
      <td class="lbl">Remise ({{ $calculs['remise_taux'] }}%)</td>
      <td class="val" style="color:#c0392b;">− {{ number_format($calculs['montant_remise'], 0, ',', ' ') }} F</td>
    </tr>
    @endif
    <tr>
      <td class="lbl">Montant net HT</td>
      <td class="val">{{ number_format($calculs['montant_net_ht'], 0, ',', ' ') }} F</td>
    </tr>
    <tr>
      <td class="lbl">TVA ({{ $calculs['tva_taux'] }}%)</td>
      <td class="val">{{ number_format($calculs['tva_montant'], 0, ',', ' ') }} F</td>
    </tr>
    <tr class="r-ttc">
      <td class="lbl">TOTAL TTC</td>
      <td class="val">{{ number_format($calculs['total_ttc'], 0, ',', ' ') }} F CFA</td>
    </tr>
    @if($calculs['acompte_montant'] > 0)
    <tr class="r-ac">
      <td class="lbl">Acompte demandé</td>
      <td class="val">{{ number_format($calculs['acompte_montant'], 0, ',', ' ') }} F</td>
    </tr>
    <tr class="r-rp">
      <td class="lbl">Reste à payer</td>
      <td class="val">{{ number_format($calculs['reste_a_payer'], 0, ',', ' ') }} F</td>
    </tr>
    @endif
  </table>

  <!-- CONDITIONS -->
  <table style="width:100%; margin-bottom:10px;" cellpadding="0" cellspacing="0">
    <tr>
      <td class="cond-box">
        <span class="cond-titre">Conditions</span><br>
        Condition 1 : Délai de production et de réception 01–20 jours à compter de la validation de la maquette.<br>
        Condition 2 : Paiement préalable d'un acompte de 70% si le montant TTC excède 200 000 F CFA et 30% à la réception. Cas échéant, 50% à la commande et 50% à la réception.<br>
        <strong>Ce pro forma est valable 30 jours à compter de la date d'émission.</strong>
      </td>
    </tr>
  </table>

  <!-- SIGNATURES -->
  <table class="sig-tbl" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:50%; text-align:center;">
        <span class="sig-label">Le client</span>
        <span class="sig-name">{{ $commande->client->nom_complet }}</span>
        <span class="sig-line">Signature &amp; cachet</span>
      </td>
      <td style="width:50%; text-align:center;">
        <span class="sig-label">Le responsable</span>
        <span class="sig-name">
          @if(!empty($commande->agent))
            {{ $commande->agent->prenom ?? '' }} {{ $commande->agent->nom ?? '' }}
          @endif
        </span>
        <span class="sig-line">Signature &amp; cachet</span>
      </td>
    </tr>
  </table>

</div>
</body>
</html>