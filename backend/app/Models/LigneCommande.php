<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    public $timestamps = false;

    protected $table = 'lignes_commande';

    protected $fillable = [
        'commande_id', 'designation', 'quantite',
        'prix_unitaire', 'sous_total', 'ordre', 'synced_at',
    ];

    protected $casts = [
        'quantite'      => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'sous_total'    => 'decimal:2',
        'synced_at'     => 'datetime',
        'updated_at'    => 'datetime',
    ];

    protected static function booted(): void
    {
        // Calcul automatique du sous_total avant sauvegarde
        static::saving(function (LigneCommande $ligne) {
            $ligne->sous_total = $ligne->quantite * $ligne->prix_unitaire;
        });
    }

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
}