<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30)->unique();
            $table->enum('type', ['ENTREE', 'SORTIE']);
            $table->string('categorie', 100);
            $table->decimal('montant', 15, 2);
            $table->foreignId('commande_id')->nullable()->constrained('commandes')->nullOnDelete();
            $table->text('description')->nullable();
            $table->enum('statut_validation', ['EN_ATTENTE', 'VALIDE', 'REJETE'])->default('EN_ATTENTE');
            $table->foreignId('valide_par')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date_transaction');
            $table->foreignId('agent_id')->constrained('users')->restrictOnDelete();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};