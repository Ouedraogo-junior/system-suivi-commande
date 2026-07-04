{{-- Ce fragment est écrit séparément par DocumentController::ecrireAvecGardeFouSignature().
     Il réutilise les classes .sig-fixed / .sig-tbl définies dans le <style> des vues
     documents.proforma et documents.facture, qui restent actives pour tout appel
     WriteHTML() ultérieur sur le même objet $mpdf.

     Structure à PLAT (pas de tables imbriquées) : les deux colonnes partagent les
     mêmes <tr>, ce qui garantit que "Le client" et "Le responsable" sont sur la
     même ligne, quelle que soit la présence du cachet. --}}
<div class="sig-fixed">
<table class="sig-tbl" cellpadding="0" cellspacing="0">
<tr>
<td style="width:50%; text-align:center; font-size:7pt; font-weight:bold; color:#1a5c2a; text-transform:uppercase; padding-bottom:4px;">Le client</td>
<td style="width:50%; text-align:center; font-size:7pt; font-weight:bold; color:#1a5c2a; text-transform:uppercase; padding-bottom:4px;">Le responsable</td>
</tr>
<tr>
<td style="text-align:center; height:48px; vertical-align:bottom;">&nbsp;</td>
<td style="text-align:center; height:48px; vertical-align:bottom;">
@if(file_exists(public_path('images/cachet.png')))
<img src="{{ public_path('images/cachet.png') }}" style="height:45px;">
@endif
</td>
</tr>
<tr>
<td style="text-align:center; font-size:7.5pt; color:#333; padding-top:2px;">{{ $commande->client->nom_complet }}</td>
<td style="text-align:center; font-size:7.5pt; color:#333; padding-top:2px;">
@if(!empty($commande->agent))
{{ $commande->agent->prenom ?? '' }} {{ $commande->agent->nom ?? '' }}
@endif
</td>
</tr>
</table>
</div>