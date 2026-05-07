<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueCommande extends Model
{
    public $timestamps = false;

    protected $table = 'historique_commandes';

    protected $fillable = [
        'commande_id', 'agent_id', 'ancien_statut',
        'nouveau_statut', 'commentaire', 'synced_at',
    ];

    protected $casts = [
        'synced_at'  => 'datetime',
        'created_at' => 'datetime',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}