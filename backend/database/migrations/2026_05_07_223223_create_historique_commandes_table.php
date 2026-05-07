<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('historique_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('users')->restrictOnDelete();
            $table->enum('ancien_statut', ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'])->nullable();
            $table->enum('nouveau_statut', ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE']);
            $table->text('commentaire')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_commandes');
    }
};