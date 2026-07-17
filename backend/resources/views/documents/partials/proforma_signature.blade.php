{{-- Ce fragment est écrit séparément par DocumentController::ecrireAvecGardeFouSignature().
     Il réutilise la classe .sig-fixed définie dans le <style> des vues
     documents.proforma et documents.facture.
     Chaque colonne (client / responsable) est un tableau imbriqué INDÉPENDANT :
     les titres restent alignés car les deux <td> parents démarrent à la même
     position (vertical-align:top), mais le contenu de chaque colonne (nom du
     client vs signature+cachet+nom du responsable) s'enchaîne SANS dépendre
     de la hauteur de l'autre colonne. C'est ce découplage qui manquait dans
     les versions précédentes (position:absolute imbriqué non fiable dans mPDF,
     et lignes <tr> partagées qui synchronisaient les hauteurs à tort). --}}
<div class="sig-fixed">
<table class="sig-tbl" cellpadding="0" cellspacing="0" style="width:100%;">
<tr>
  <td style="width:50%; vertical-align:top; padding:0;">
    <table cellpadding="0" cellspacing="0" style="width:100%;">
    <tr>
    <td style="text-align:center; font-size:7pt; font-weight:bold; color:#1a5c2a; text-transform:uppercase; padding-bottom:4px;">{{ $labelGauche ?? 'Le client' }}</td>
    </tr>
    <tr>
    <td style="text-align:center; font-size:7.5pt; color:#333; padding-top:80px;">{{ $commande->client->nom_complet }}</td>
    </tr>
    </table>
    </td>
    <td style="width:50%; vertical-align:top; padding:0;">
    <table cellpadding="0" cellspacing="0" style="width:100%;">
    <tr>
    <td style="text-align:center; font-size:7pt; font-weight:bold; color:#1a5c2a; text-transform:uppercase; padding-bottom:4px;">{{ $labelDroite ?? 'Le responsable' }}</td>
    </tr>
    <tr>
    <td style="text-align:center;">
    @if(empty($sansCachet) && file_exists(public_path('images/sign_cachet.png')))
    <img src="{{ public_path('images/sign_cachet.png') }}" style="max-height:200px;">
    @endif
    </td>
    </tr>
    <tr>
    <td style="text-align:center; font-size:7.5pt; color:#333; padding-top:2px;">
    @if(!empty($commande->agent))
    {{ $commande->agent->prenom ?? '' }} {{ $commande->agent->nom ?? '' }}
    @endif
    </td>
    </tr>
    </table>
    </td>
</tr>
</table>
</div>