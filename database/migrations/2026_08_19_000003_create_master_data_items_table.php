<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_data_items', function (Blueprint $table): void {
            $table->id();
            $table->string('category');
            $table->string('name');
            $table->unsignedBigInteger('value')->nullable();
            $table->string('unit')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();

            $table->index(['category', 'status']);
        });

        DB::table('master_data_items')->insert([
            ['category' => 'structure_specification', 'name' => 'Besi S', 'value' => null, 'unit' => null, 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'structure_specification', 'name' => 'Besi M', 'value' => null, 'unit' => null, 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'structure_specification', 'name' => 'Besi L', 'value' => null, 'unit' => null, 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'structure_specification', 'name' => '4D10 + Begel D8-15', 'value' => null, 'unit' => null, 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'request_cost', 'name' => 'Atap model limas', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'request_cost', 'name' => 'Kanopi', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'request_cost', 'name' => 'Pagar depan', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'finishing_cost', 'name' => 'KM/WC', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'finishing_cost', 'name' => 'Plesteran luar dalam', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'finishing_cost', 'name' => 'Pasang keramik', 'value' => 0, 'unit' => 'item', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'building_price', 'name' => 'Non-finishing', 'value' => 1700000, 'unit' => 'm2', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'building_price', 'name' => 'Finishing', 'value' => 2500000, 'unit' => 'm2', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['category' => 'region', 'name' => 'Test', 'value' => null, 'unit' => 'desa', 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_data_items');
    }
};
