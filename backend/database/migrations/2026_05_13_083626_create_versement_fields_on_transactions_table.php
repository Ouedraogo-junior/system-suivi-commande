<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('versement_id')
                ->nullable()
                ->after('commande_id')
                ->constrained('versements')
                ->nullOnDelete();
            $table->foreignId('modifie_par')
                ->nullable()
                ->after('valide_par')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('modifie_le')->nullable()->after('modifie_par');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['versement_id']);
            $table->dropForeign(['modifie_par']);
            $table->dropColumn(['versement_id', 'modifie_par', 'modifie_le']);
        });
    }
};
