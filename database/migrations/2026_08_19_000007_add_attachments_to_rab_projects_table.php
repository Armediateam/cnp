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
        Schema::table('rab_projects', function (Blueprint $table): void {
            $table->json('floor_plan_files')->nullable()->after('project_address');
            $table->json('facade_files')->nullable()->after('floor_plan_files');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rab_projects', function (Blueprint $table): void {
            $table->dropColumn(['floor_plan_files', 'facade_files']);
        });
    }
};
