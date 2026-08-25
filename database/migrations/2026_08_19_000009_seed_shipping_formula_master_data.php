<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        foreach ([
            ['category' => 'request_cost', 'name' => 'Ongkos kirim material request', 'value' => 35000, 'unit' => 'km'],
            ['category' => 'finishing_cost', 'name' => 'Ongkos kirim material finishing', 'value' => 35000, 'unit' => 'km'],
        ] as $item) {
            DB::table('master_data_items')->updateOrInsert(
                [
                    'category' => $item['category'],
                    'name' => $item['name'],
                ],
                [
                    'value' => $item['value'],
                    'unit' => $item['unit'],
                    'status' => 'Active',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('master_data_items')
            ->whereIn('name', [
                'Ongkos kirim material request',
                'Ongkos kirim material finishing',
            ])
            ->delete();
    }
};
