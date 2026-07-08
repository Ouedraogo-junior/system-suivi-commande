<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{

    protected $fillable = [
        'commande_id', 'agent_id', 'type',
        'reference', 'chemin_fichier', 'synced_at',
    ];

    protected $casts = [
        'synced_at'  => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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