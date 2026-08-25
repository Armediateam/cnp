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
            $table->string('rab_number')->nullable()->after('village_name');
            $table->date('rab_date')->nullable()->after('rab_number');
            $table->string('project_name')->nullable()->after('rab_date');
            $table->text('project_address')->nullable()->after('project_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rab_projects', function (Blueprint $table) {
            $table->dropColumn([
                'rab_number',
                'rab_date',
                'project_name',
                'project_address',
            ]);
        });
    }
};
