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
            ['category' => 'request_cost', 'name' => 'Atap model limas', 'value' => 1000000, 'unit' => 'm2'],
            ['category' => 'request_cost', 'name' => 'Tambah dinding', 'value' => 0, 'unit' => 'm2'],
            ['category' => 'request_cost', 'name' => 'Tambah tinggi dinding', 'value' => 0, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'KM / WC', 'value' => 4000000, 'unit' => 'unit'],
            ['category' => 'finishing_cost', 'name' => 'Plesteran luar dalam', 'value' => 235000, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Acian luar dalam', 'value' => 235000, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Pasang keramik 40/40cm', 'value' => 266223, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Plafond luar dalam', 'value' => 297111, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Instalasi listrik', 'value' => 66667, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Pengecatan ex Nippon (putih)', 'value' => 133333, 'unit' => 'm2'],
            ['category' => 'finishing_cost', 'name' => 'Septictank', 'value' => 6000000, 'unit' => 'unit'],
            ['category' => 'finishing_cost', 'name' => 'Perawatan & pembersihan', 'value' => 44444, 'unit' => 'm2'],
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
                'Tambah dinding',
                'Tambah tinggi dinding',
                'KM / WC',
                'Acian luar dalam',
                'Pasang keramik 40/40cm',
                'Plafond luar dalam',
                'Instalasi listrik',
                'Pengecatan ex Nippon (putih)',
                'Septictank',
                'Perawatan & pembersihan',
            ])
            ->delete();
    }
};
