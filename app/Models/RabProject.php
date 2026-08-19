<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $customer_name
 * @property string $village_name
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'customer_name',
    'village_name',
    'length',
    'width',
    'building_area',
    'price_per_meter',
    'building_cost',
    'specification',
    'request_items',
    'request_items_total',
    'request_shipping_cost',
    'request_other_cost',
    'request_dp_percent',
    'request_start_percent',
    'request_installments',
    'finishing_items',
    'finishing_items_total',
    'finishing_shipping_cost',
    'finishing_other_cost',
    'finishing_dp_percent',
    'finishing_installments',
    'grand_total',
    'status',
])]
class RabProject extends Model
{
    /** @use HasFactory<\Database\Factories\RabProjectFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'length' => 'decimal:2',
            'width' => 'decimal:2',
            'building_area' => 'decimal:2',
            'price_per_meter' => 'integer',
            'building_cost' => 'integer',
            'request_items' => 'array',
            'request_items_total' => 'integer',
            'request_shipping_cost' => 'integer',
            'request_other_cost' => 'integer',
            'request_dp_percent' => 'decimal:2',
            'request_start_percent' => 'decimal:2',
            'request_installments' => 'integer',
            'finishing_items' => 'array',
            'finishing_items_total' => 'integer',
            'finishing_shipping_cost' => 'integer',
            'finishing_other_cost' => 'integer',
            'finishing_dp_percent' => 'decimal:2',
            'finishing_installments' => 'integer',
            'grand_total' => 'integer',
        ];
    }
}
