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
        Schema::table('commandes', function (Blueprint $table) {
            $table->enum('remise_type', ['PERCENT', 'MONTANT'])
                ->default('PERCENT')
                ->after('remise');
        });

        // Élargir remise pour supporter les montants fixes (nécessite doctrine/dbal)
        Schema::table('commandes', function (Blueprint $table) {
            $table->decimal('remise', 15, 2)->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropColumn('remise_type');
            $table->decimal('remise', 5, 2)->default(0)->change();
        });
    }
};
