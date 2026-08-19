<?php

namespace App\Http\Controllers;

use App\Models\MasterDataItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    /**
     * Show the master data page.
     */
    public function index(): Response
    {
        return Inertia::render('master-data', [
            'items' => MasterDataItem::query()
                ->latest()
                ->get()
                ->map(fn (MasterDataItem $item): array => [
                    'id' => $item->id,
                    'category' => $item->category,
                    'name' => $item->name,
                    'value' => $item->value,
                    'unit' => $item->unit,
                    'status' => $item->status,
                    'createdAt' => $item->created_at?->format('d M Y'),
                ]),
        ]);
    }

    /**
     * Store a newly created master data item.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);

        MasterDataItem::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Master data berhasil dibuat.']);

        return to_route('master-data');
    }

    /**
     * Update the master data item.
     */
    public function update(Request $request, MasterDataItem $masterDataItem): RedirectResponse
    {
        $validated = $this->validateRequest($request);

        $masterDataItem->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Master data berhasil diperbarui.']);

        return to_route('master-data');
    }

    /**
     * Delete the master data item.
     */
    public function destroy(MasterDataItem $masterDataItem): RedirectResponse
    {
        $masterDataItem->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Master data berhasil dihapus.']);

        return to_route('master-data');
    }

    /**
     * Validate master data payload.
     *
     * @return array<string, mixed>
     */
    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'category' => ['required', 'string', Rule::in([
                'structure_specification',
                'request_cost',
                'finishing_cost',
                'building_price',
                'region',
            ])],
            'name' => ['required', 'string', 'max:255'],
            'value' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', Rule::in(['Active', 'Inactive'])],
        ]);
    }
}
