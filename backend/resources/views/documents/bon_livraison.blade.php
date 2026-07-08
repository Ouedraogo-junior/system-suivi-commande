<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Bon de Livraison {{ $reference }}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DejaVu Sans', sans-serif; font-size: 8pt; color: #1a1a1a; }

  /* ── HEADER LOGO ── */
  /* .logo-wrap {
    width: 100%;
    text-align: center;
    border-bottom: 2px solid #1a5c2a;
    padding-bottom: 6px;
    margin-bottom: 8px;
  } */
  .logo-wrap img { width: 100%; max-height: 60px; object-fit: contain; }
  .logo-fallback     { font-size: 13pt; font-weight: bold; color: #1a5c2a; letter-spacing: 2px; }
  .logo-fallback-sub { font-size: 6pt; color: #888; }

  /* ── TITRE ── */
  .titre-bar { width: 100%; background: #1a5c2a; margin-bottom: 10px; }

  /* ── DESTINATAIRE / OBJET ── */
  .meta-box {
    width: 100%;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-collapse: collapse;
  }
  .meta-box td {
    padding: 5px 8px;
    font-size: 8pt;
    border-bottom: 1px solid #eee;
    line-height: 1.6;
  }
  .meta-box td:first-child {
    font-weight: bold;
    color: #1a5c2a;
    width: 80px;
    white-space: nowrap;
  }

  /* ── TABLEAU LIGNES ── */
  .tbl { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .tbl thead tr { background: #1a5c2a; }
  .tbl thead th {
    color: #fff; padding: 5px 6px;
    font-size: 7.5pt; font-weight: bold; text-align: left;
  }
  .tbl thead th.c { text-align: center; }
  .tbl thead th.r { text-align: right; }
  .tbl tbody tr { border-bottom: 1px solid #e8e8e8; }
  .tbl tbody tr.alt { background: #f8f6f0; }
  .tbl tbody td { padding: 5px 6px; font-size: 7.5pt; }
  .tbl tbody td.c { text-align: center; color: #000; font-size: 7pt; }
  .tbl tbody td.r { text-align: right; }
  .tbl tbody td.obs { color: #ccc; font-style: italic; font-size: 7pt; }

  /* ── LIEU ET DATE ── */
  .lieu-date {
    text-align: right;
    font-size: 8pt;
    margin-bottom: 20px;
    color: #333;
  }

  /* ── SIGNATURES ── */
  .sig-fixed {
     position: fixed;
     bottom: 10mm;
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
        <span style="font-size:12pt; font-weight:bold; letter-spacing:2px; color:#fff;">BON DE LIVRAISON {{ $reference }}</span><br>
        <span style="color:#fff; font-size:7pt;">
          {{-- {{ $reference }} &nbsp;|&nbsp;  --}}
          {{ now()->locale('fr')->isoFormat('D MMMM YYYY') }}
        </span>
      </td>
    </tr>
  </table>

  <!-- DESTINATAIRE / OBJET -->
  <table class="meta-box" cellpadding="0" cellspacing="0">
    <tr>
      <td>DOIT :</td>
      <td>
        <strong>{{ $commande->client->nom_complet }}</strong>
        @if($commande->client->organisation)
          &nbsp;—&nbsp; {{ $commande->client->organisation }}
        @endif
      </td>
    </tr>
    @if(!empty($objet))
    <tr>
      <td>OBJET :</td>
      <td>{{ $objet }}</td>
    </tr>
    @endif
  </table>

  <!-- LIGNES -->
  <table class="tbl" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th class="c" style="width:28px;">N°</th>
        <th>Désignation</th>
        <th class="r" style="width:80px;">Quantité</th>
        <th style="width:130px;">Observations</th>
      </tr>
    </thead>
    <tbody>
      @foreach($commande->lignes->sortBy('ordre') as $i => $ligne)
      <tr class="{{ $i % 2 === 1 ? 'alt' : '' }}">
        <td class="c">{{ $i + 1 }}</td>
        <td>{{ $ligne->designation }}</td>
        <td class="r">{{ number_format($ligne->quantite, 0, ',', ' ') }}</td>
        <td class="obs"></td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <!-- LIEU ET DATE -->
  <div class="lieu-date">
    Ouagadougou le ........./........./{{ now()->year }}
  </div>

  <!-- SIGNATURES -->
  {{-- <table class="sig-tbl" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <span class="sig-label">Le Réceptionniste</span>
      </td>
      <td>
        <span class="sig-label">Le Fournisseur</span>
      </td>
    </tr>
  </table> --}}

</div>
</body>
</html>