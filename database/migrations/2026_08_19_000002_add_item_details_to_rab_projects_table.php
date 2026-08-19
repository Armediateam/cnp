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
        Schema::table('rab_projects', function (Blueprint $table) {
            $table->json('request_items')->nullable()->after('specification');
            $table->json('finishing_items')->nullable()->after('request_installments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rab_projects', function (Blueprint $table) {
            $table->dropColumn(['request_items', 'finishing_items']);
        });
    }
};
