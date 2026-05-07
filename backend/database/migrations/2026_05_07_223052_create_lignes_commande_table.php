<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lignes_commande', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
            $table->string('designation', 255);
            $table->decimal('quantite', 10, 2);
            $table->decimal('prix_unitaire', 15, 2);
            $table->decimal('sous_total', 15, 2); // calculé : quantite × prix_unitaire
            $table->integer('ordre')->default(1);
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lignes_commande');
    }
};