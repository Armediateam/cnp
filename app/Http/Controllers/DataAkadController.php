<?php

namespace App\Http\Controllers;

use App\Models\PurchaseForm;
use Inertia\Inertia;
use Inertia\Response;

class DataAkadController extends Controller
{
    /**
     * Show Data Akad in dashboard.
     */
    public function __invoke(): Response
    {
        return Inertia::render('data-akad', [
            'metrics' => [
                'total' => PurchaseForm::where('is_akad', true)->count(),
                'today' => PurchaseForm::query()
                    ->where('is_akad', true)
                    ->whereDate('created_at', today())
                    ->count(),
                'thisMonth' => PurchaseForm::query()
                    ->where('is_akad', true)
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'withAttachments' => PurchaseForm::query()
                    ->where('is_akad', true)
                    ->where(fn ($query) => $query
                        ->whereNotNull('ktp_photo_path')
                        ->orWhereNotNull('sketch_photo_path'))
                    ->count(),
            ],
            'purchaseForms' => PurchaseForm::query()
                ->where('is_akad', true)
                ->latest()
                ->get()
                ->map(fn (PurchaseForm $item): array => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'birthPlace' => $item->birth_place,
                    'birthDate' => $item->birth_date ? \Carbon\Carbon::parse($item->birth_date)->format('d M Y') : null,
                    'age' => $item->age,
                    'phone' => $item->phone,
                    'email' => $item->email,
                    'occupation' => $item->occupation,
                    'address' => $item->address,
                    'rt' => $item->rt,
                    'rw' => $item->rw,
                    'village' => $item->village,
                    'district' => $item->district,
                    'regency' => $item->regency,
                    'province' => $item->province,
                    'houseArea' => $item->house_area,
                    'location' => $item->location,
                    'informationSource' => $item->information_source,
                    'carAccess' => $item->car_access,
                    'spouseName' => $item->spouse_name,
                    'spousePhone' => $item->spouse_phone,
                    'ktpPhotoPath' => $item->ktp_photo_path,
                    'rabFilePath' => $item->rab_file_path,
                    'sketchPhotoPath' => $item->sketch_photo_path,
                    'region' => $item->region,
                    'createdAt' => $item->created_at?->format('d M Y H:i'),
                ]),
        ]);
    }
}
