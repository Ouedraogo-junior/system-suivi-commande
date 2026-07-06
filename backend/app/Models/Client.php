<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_complet', 'telephone', 'fax', 'email', 'adresse', 'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'client_id');
    }

    public function versements()
    {
        return $this->hasMany(Versement::class, 'agent_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'agent_id');
    }
}