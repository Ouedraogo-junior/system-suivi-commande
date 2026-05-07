<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Versement extends Model
{
    protected $fillable = [
        'commande_id', 'agent_id', 'numero_versement', 'montant',
        'date_versement', 'reference', 'notes',
        'statut_validation', 'valide_par', 'synced_at',
    ];

    protected $casts = [
        'montant'        => 'decimal:2',
        'date_versement' => 'date',
        'synced_at'      => 'datetime',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function validePar()
    {
        return $this->belongsTo(User::class, 'valide_par');
    }
}