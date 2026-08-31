<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'birth_place',
    'birth_date',
    'age',
    'phone',
    'email',
    'occupation',
    'address',
    'rt',
    'rw',
    'village',
    'district',
    'regency',
    'province',
    'house_area',
    'location',
    'information_source',
    'car_access',
    'spouse_name',
    'spouse_phone',
    'ktp_photo_path',
    'rab_file_path',
    'sketch_photo_path',
    'region',
    'is_akad',
])]
class PurchaseForm extends Model
{
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'age' => 'integer',
            'is_akad' => 'boolean',
        ];
    }
}
