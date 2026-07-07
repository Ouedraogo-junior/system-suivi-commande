<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'client_id', 'agent_id', 'service', 'statut',
        'statut_paiement', 'montant_total', 'montant_paye', 'remise','remise_type',
        'tva_applicable', 'date_echeance', 'notes', 'synced_at', 'tva_taux',
    ];

    protected $casts = [
        'tva_applicable' => 'boolean',
        'montant_total'  => 'decimal:2',
        'montant_paye'   => 'decimal:2',
        'remise'         => 'decimal:2',
        'remise_type'    => 'string',
        'date_echeance'  => 'date',
        'synced_at'      => 'datetime',
        'tva_taux' => 'decimal:2',
    ];

    // Relations
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function lignes()
    {
        return $this->hasMany(LigneCommande::class)->orderBy('ordre');
    }

    public function versements()
    {
        return $this->hasMany(Versement::class)->orderBy('created_at');
    }

    public function documents()
    {
        return $this->hasMany(Document::class)->orderBy('created_at');
    }

    public function historique()
    {
        return $this->hasMany(HistoriqueCommande::class)->orderBy('created_at');
    }

    // Helpers
    public function montantRestant(): float
    {
        return max(0, $this->montant_total - $this->montant_paye);
    }

    public function recalculerMontantTotal(): void
    {
        $sous_total = $this->lignes()->sum('sous_total');
          $montant_remise = $this->remise_type === 'MONTANT'
              ? min((float) $this->remise, $sous_total)
              : $sous_total * ($this->remise / 100);
          $apres_remise = $sous_total - $montant_remise;
        $this->montant_total = $this->tva_applicable
            ? $apres_remise * (1 + $this->tva_taux / 100)
            : $apres_remise;
        $this->save();
    }

    public function recalculerMontantPaye(): void
    {
        $this->montant_paye = $this->versements()
            ->where('statut_validation', 'VALIDE')
            ->sum('montant');

        $this->statut_paiement = match(true) {
            $this->montant_paye <= 0                    => 'NON_PAYE',
            $this->montant_paye >= $this->montant_total => 'PAYE',
            default                                      => 'PARTIEL',
        };

        $this->appliquerStatutAutomatique();

        $this->save();
    }

    /**
     * Fait progresser automatiquement le statut commande en fonction du
     * paiement, uniquement vers l'avant (EN_ATTENTE → EN_COURS → TERMINE).
     * - Ne touche jamais à ANNULE.
     * - Ne rétrograde jamais un statut déjà atteint (suppression/modification
     *   d'un versement sur une commande TERMINE ou EN_COURS : le statut ne
     *   redescend pas).
     * - Le changement manuel (CommandeController@changerStatut) reste
     *   possible en plus, notamment pour passer en EN_COURS avant tout
     *   paiement.
     */
    private function appliquerStatutAutomatique(): void
    {
        if ($this->statut === 'ANNULE') {
            return;
        }

        if ($this->statut === 'EN_ATTENTE' && $this->montant_paye > 0) {
            $this->statut = 'EN_COURS';
        }

        if ($this->statut === 'EN_COURS' && $this->montant_total > 0 && $this->montant_paye >= $this->montant_total) {
            $this->statut = 'TERMINE';
        }
    }
}