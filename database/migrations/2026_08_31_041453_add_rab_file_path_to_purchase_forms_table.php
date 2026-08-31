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
        Schema::table('purchase_forms', function (Blueprint $table) {
            $table->string('rab_file_path', 2048)->nullable()->after('ktp_photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_forms', function (Blueprint $table) {
            $table->dropColumn('rab_file_path');
        });
    }
};
