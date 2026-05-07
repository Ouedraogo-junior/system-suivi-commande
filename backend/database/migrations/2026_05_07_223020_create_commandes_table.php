<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30)->unique();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignId('agent_id')->constrained('users')->restrictOnDelete();
            $table->enum('service', ['IMPRIMERIE', 'INFORMATIQUE', 'NEGOCE', 'AMENAGEMENT']);
            $table->enum('statut', ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'])->default('EN_ATTENTE');
            $table->enum('statut_paiement', ['NON_PAYE', 'PARTIEL', 'PAYE'])->default('NON_PAYE');
            $table->decimal('montant_total', 15, 2)->default(0);
            $table->decimal('montant_paye', 15, 2)->default(0);
            $table->decimal('remise', 5, 2)->default(0); // pourcentage
            $table->boolean('tva_applicable')->default(false);
            $table->date('date_echeance')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};