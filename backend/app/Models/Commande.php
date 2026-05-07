<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'client_id', 'agent_id', 'service', 'statut',
        'statut_paiement', 'montant_total', 'montant_paye', 'remise',
        'tva_applicable', 'date_echeance', 'notes', 'synced_at',
    ];

    protected $casts = [
        'tva_applicable' => 'boolean',
        'montant_total'  => 'decimal:2',
        'montant_paye'   => 'decimal:2',
        'remise'         => 'decimal:2',
        'date_echeance'  => 'date',
        'synced_at'      => 'datetime',
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
        $apres_remise = $sous_total * (1 - $this->remise / 100);
        $this->montant_total = $this->tva_applicable
            ? $apres_remise * 1.18
            : $apres_remise;
        $this->save();
    }

    public function recalculerMontantPaye(): void
    {
        $this->montant_paye = $this->versements()
            ->where('statut_validation', 'VALIDE')
            ->sum('montant');

        $this->statut_paiement = match(true) {
            $this->montant_paye <= 0                          => 'NON_PAYE',
            $this->montant_paye >= $this->montant_total       => 'PAYE',
            default                                            => 'PARTIEL',
        };

        $this->save();
    }
}