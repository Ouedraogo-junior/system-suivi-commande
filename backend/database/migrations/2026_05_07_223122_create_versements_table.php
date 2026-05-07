<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('versements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('users')->restrictOnDelete();
            $table->integer('numero_versement');
            $table->decimal('montant', 15, 2);
            $table->date('date_versement');
            $table->string('reference', 100)->nullable();
            $table->text('notes')->nullable();
            $table->enum('statut_validation', ['EN_ATTENTE', 'VALIDE', 'REJETE'])->default('EN_ATTENTE');
            $table->foreignId('valide_par')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('versements');
    }
};