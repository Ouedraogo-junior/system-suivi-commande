<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nom_complet' => 'Administrateur SOGECOP',
            'pseudo'      => 'admin',
            'password'    => 'sogecop2025',
            'role'        => 'ADMIN',
            'actif'       => true,
        ]);
    }
}