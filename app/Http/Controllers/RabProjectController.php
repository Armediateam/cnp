<?php

namespace App\Http\Controllers;

use App\Models\MasterDataItem;
use App\Models\RabProject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
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
            'masterDataItems' => MasterDataItem::query()
                ->where('status', 'Active')
                ->whereIn('category', [
                    'structure_specification',
                    'request_cost',
                    'finishing_cost',
                    'building_price',
                    'region',
                ])
                ->orderBy('name')
                ->get()
                ->map(fn (MasterDataItem $item): array => [
                    'id' => $item->id,
                    'category' => $item->category,
                    'name' => $item->name,
                    'value' => $item->value,
                    'unit' => $item->unit,
                ]),
            'rabProjects' => RabProject::query()
                ->latest()
                ->get()
                ->map(fn (RabProject $project): array => [
                    'id' => $project->id,
                    'customer' => $project->customer_name,
                    'village' => $project->village_name,
                    'rabNumber' => $project->rab_number,
                    'rabDate' => $project->rab_date?->format('Y-m-d'),
                    'projectName' => $project->project_name,
                    'projectAddress' => $project->project_address,
                    'floorPlanFiles' => $project->floor_plan_files ?? [],
                    'facadeFiles' => $project->facade_files ?? [],
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
            'rab_number' => ['nullable', 'string', 'max:255'],
            'rab_date' => ['nullable', 'date'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'project_address' => ['nullable', 'string', 'max:2000'],
            'floor_plan_files' => ['nullable', 'array'],
            'floor_plan_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            'facade_files' => ['nullable', 'array'],
            'facade_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'building_area' => ['nullable', 'numeric', 'min:0'],
            'price_per_meter' => ['nullable', 'numeric', 'min:0'],
            'building_cost' => ['nullable', 'numeric', 'min:0'],
            'specification' => ['nullable', 'string', 'max:255'],
            'request_items' => ['nullable', 'array'],
            'request_items.*.label' => ['required_with:request_items', 'string', 'max:255'],
            'request_items.*.unit' => ['nullable', 'string', 'max:50'],
            'request_items.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'request_items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
            'request_items.*.cost' => ['required_with:request_items', 'numeric', 'min:0'],
            'request_items_total' => ['nullable', 'numeric', 'min:0'],
            'request_shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'request_other_cost' => ['nullable', 'numeric', 'min:0'],
            'request_dp_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'request_start_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'request_installments' => ['nullable', 'integer', 'min:0'],
            'finishing_items' => ['nullable', 'array'],
            'finishing_items.*.label' => ['required_with:finishing_items', 'string', 'max:255'],
            'finishing_items.*.unit' => ['nullable', 'string', 'max:50'],
            'finishing_items.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'finishing_items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
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

        unset($validated['floor_plan_files'], $validated['facade_files']);

        foreach (['request_items', 'finishing_items'] as $itemsField) {
            $validated[$itemsField] = collect($validated[$itemsField] ?? [])
                ->map(fn (array $item): array => [
                    'label' => $item['label'],
                    'unit' => $item['unit'] ?? null,
                    'quantity' => round((float) ($item['quantity'] ?? 1), 3),
                    'unit_price' => (int) round($item['unit_price'] ?? $item['cost']),
                    'cost' => (int) round($item['cost']),
                ])
                ->values()
                ->all();
        }

        RabProject::create([
            ...$validated,
            'floor_plan_files' => $this->storeAttachments($request, 'floor_plan_files'),
            'facade_files' => $this->storeAttachments($request, 'facade_files'),
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
            'rab_number' => ['nullable', 'string', 'max:255'],
            'rab_date' => ['nullable', 'date'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'project_address' => ['nullable', 'string', 'max:2000'],
            'floor_plan_files' => ['nullable', 'array'],
            'floor_plan_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            'facade_files' => ['nullable', 'array'],
            'facade_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
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

        unset($validated['floor_plan_files'], $validated['facade_files']);

        $validated['floor_plan_files'] = [
            ...($rabProject->floor_plan_files ?? []),
            ...$this->storeAttachments($request, 'floor_plan_files'),
        ];
        $validated['facade_files'] = [
            ...($rabProject->facade_files ?? []),
            ...$this->storeAttachments($request, 'facade_files'),
        ];

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

    /**
     * Store uploaded RAB attachments.
     *
     * @return array<int, array{name: string, path: string, url: string, mime: string|null}>
     */
    private function storeAttachments(Request $request, string $field): array
    {
        return collect($request->file($field, []))
            ->filter(fn (mixed $file): bool => $file instanceof UploadedFile)
            ->map(function (UploadedFile $file) use ($field): array {
                $path = $file->store("rab/{$field}", 'public');

                return [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'url' => asset("storage/{$path}"),
                    'mime' => $file->getClientMimeType(),
                ];
            })
            ->values()
            ->all();
    }
}
