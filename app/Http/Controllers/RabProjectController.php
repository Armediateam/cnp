<?php

namespace App\Http\Controllers;

use App\Models\RabProject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RabProjectController extends Controller
{
    /**
     * Show the RAB project list.
     */
    public function index(): Response
    {
        return Inertia::render('rab-project', [
            'rabProjects' => RabProject::query()
                ->latest()
                ->get()
                ->map(fn (RabProject $project): array => [
                    'id' => $project->id,
                    'customer' => $project->customer_name,
                    'village' => $project->village_name,
                    'area' => rtrim(rtrim((string) $project->building_area, '0'), '.').' m2',
                    'total' => $project->grand_total,
                    'status' => $project->status,
                    'length' => (float) $project->length,
                    'width' => (float) $project->width,
                    'buildingArea' => (float) $project->building_area,
                    'pricePerMeter' => $project->price_per_meter,
                    'buildingCost' => $project->building_cost,
                    'specification' => $project->specification,
                    'requestItems' => $project->request_items ?? [],
                    'requestItemsTotal' => $project->request_items_total,
                    'requestShippingCost' => $project->request_shipping_cost,
                    'requestOtherCost' => $project->request_other_cost,
                    'requestDpPercent' => (float) $project->request_dp_percent,
                    'requestStartPercent' => (float) $project->request_start_percent,
                    'requestInstallments' => $project->request_installments,
                    'finishingItems' => $project->finishing_items ?? [],
                    'finishingItemsTotal' => $project->finishing_items_total,
                    'finishingShippingCost' => $project->finishing_shipping_cost,
                    'finishingOtherCost' => $project->finishing_other_cost,
                    'finishingDpPercent' => (float) $project->finishing_dp_percent,
                    'finishingInstallments' => $project->finishing_installments,
                ]),
        ]);
    }

    /**
     * Store a newly created RAB project.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'village_name' => ['required', 'string', 'max:255'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'building_area' => ['nullable', 'numeric', 'min:0'],
            'price_per_meter' => ['nullable', 'numeric', 'min:0'],
            'building_cost' => ['nullable', 'numeric', 'min:0'],
            'specification' => ['nullable', 'string', 'max:255'],
            'request_items' => ['nullable', 'array'],
            'request_items.*.label' => ['required_with:request_items', 'string', 'max:255'],
            'request_items.*.cost' => ['required_with:request_items', 'numeric', 'min:0'],
            'request_items_total' => ['nullable', 'numeric', 'min:0'],
            'request_shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'request_other_cost' => ['nullable', 'numeric', 'min:0'],
            'request_dp_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'request_start_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'request_installments' => ['nullable', 'integer', 'min:0'],
            'finishing_items' => ['nullable', 'array'],
            'finishing_items.*.label' => ['required_with:finishing_items', 'string', 'max:255'],
            'finishing_items.*.cost' => ['required_with:finishing_items', 'numeric', 'min:0'],
            'finishing_items_total' => ['nullable', 'numeric', 'min:0'],
            'finishing_shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'finishing_other_cost' => ['nullable', 'numeric', 'min:0'],
            'finishing_dp_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'finishing_installments' => ['nullable', 'integer', 'min:0'],
            'grand_total' => ['nullable', 'numeric', 'min:0'],
        ]);

        foreach ([
            'price_per_meter',
            'building_cost',
            'request_items_total',
            'request_shipping_cost',
            'request_other_cost',
            'finishing_items_total',
            'finishing_shipping_cost',
            'finishing_other_cost',
            'grand_total',
        ] as $moneyField) {
            $validated[$moneyField] = (int) round($validated[$moneyField] ?? 0);
        }

        foreach (['request_items', 'finishing_items'] as $itemsField) {
            $validated[$itemsField] = collect($validated[$itemsField] ?? [])
                ->map(fn (array $item): array => [
                    'label' => $item['label'],
                    'cost' => (int) round($item['cost']),
                ])
                ->values()
                ->all();
        }

        RabProject::create([
            ...$validated,
            'user_id' => $request->user()?->id,
            'status' => 'Draft',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'RAB berhasil dibuat.']);

        return to_route('rab-project');
    }

    /**
     * Update the RAB project status.
     */
    public function updateStatus(Request $request, RabProject $rabProject): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Draft,Review,Deal,Batal'],
        ]);

        $rabProject->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status RAB berhasil diubah.']);

        return to_route('rab-project');
    }

    /**
     * Update the RAB project.
     */
    public function update(Request $request, RabProject $rabProject): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'village_name' => ['required', 'string', 'max:255'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'building_area' => ['nullable', 'numeric', 'min:0'],
            'price_per_meter' => ['nullable', 'numeric', 'min:0'],
            'building_cost' => ['nullable', 'numeric', 'min:0'],
            'specification' => ['nullable', 'string', 'max:255'],
            'grand_total' => ['nullable', 'numeric', 'min:0'],
        ]);

        foreach (['price_per_meter', 'building_cost', 'grand_total'] as $moneyField) {
            $validated[$moneyField] = (int) round($validated[$moneyField] ?? 0);
        }

        $rabProject->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'RAB berhasil diperbarui.']);

        return to_route('rab-project');
    }

    /**
     * Delete the RAB project.
     */
    public function destroy(RabProject $rabProject): RedirectResponse
    {
        $rabProject->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'RAB berhasil dihapus.']);

        return to_route('rab-project');
    }
}
