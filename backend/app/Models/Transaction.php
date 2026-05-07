<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'reference', 'type', 'categorie', 'montant',
        'commande_id', 'description', 'statut_validation',
        'valide_par', 'date_transaction', 'agent_id', 'synced_at',
    ];

    protected $casts = [
        'montant'          => 'decimal:2',
        'date_transaction' => 'date',
        'synced_at'        => 'datetime',
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