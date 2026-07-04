<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL ne supporte pas ALTER ENUM directement via Blueprint
        // On modifie la colonne avec une requête brute
        DB::statement("ALTER TABLE documents MODIFY COLUMN type ENUM('PRO_FORMA', 'FACTURE', 'BON_LIVRAISON') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE documents MODIFY COLUMN type ENUM('PRO_FORMA', 'FACTURE') NOT NULL");
    }
};