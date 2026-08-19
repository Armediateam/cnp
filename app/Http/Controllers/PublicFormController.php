<?php

namespace App\Http\Controllers;

use App\Models\PurchaseForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicFormController extends Controller
{
    /**
     * Store a purchase form.
     */
    public function storePurchase(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'age' => ['nullable', 'integer', 'min:0'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'rt' => ['nullable', 'string', 'max:20'],
            'rw' => ['nullable', 'string', 'max:20'],
            'village' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'regency' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'house_area' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'information_source' => ['nullable', 'string', 'max:255'],
            'car_access' => ['nullable', 'string', 'max:255'],
            'spouse_name' => ['nullable', 'string', 'max:255'],
            'spouse_phone' => ['nullable', 'string', 'max:50'],
            'ktp_photo' => ['nullable', 'file', 'image', 'max:4096'],
            'sketch_photo' => ['nullable', 'file', 'image', 'max:4096'],
            'region' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['ktp_photo_path'] = $request->file('ktp_photo')?->store('purchase-forms/ktp', 'public');
        $validated['sketch_photo_path'] = $request->file('sketch_photo')?->store('purchase-forms/sketches', 'public');
        unset($validated['ktp_photo'], $validated['sketch_photo']);

        PurchaseForm::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Form beli berhasil disimpan.']);

        return to_route('form-beli');
    }
}
