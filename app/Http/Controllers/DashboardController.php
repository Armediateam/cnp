<?php

namespace App\Http\Controllers;

use App\Models\RabProject;
use App\Models\User;
use Carbon\CarbonImmutable;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard.
     */
    public function __invoke(): Response
    {
        $totalRab = RabProject::count();
        $totalRabValue = RabProject::sum('grand_total');
        $dealRabValue = RabProject::query()
            ->where('status', 'Deal')
            ->sum('grand_total');
        $totalUsers = User::count();
        $thisMonthRab = RabProject::query()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $months = collect(range(5, 0))
            ->map(fn (int $monthsAgo): CarbonImmutable => now()->toImmutable()->subMonths($monthsAgo)->startOfMonth());

        $monthlyRab = $months->map(function (CarbonImmutable $month): array {
            $query = RabProject::query()
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month);

            return [
                'month' => $month->locale('id')->isoFormat('MMM'),
                'total' => (clone $query)->count(),
                'deal' => (clone $query)->where('status', 'Deal')->count(),
            ];
        });

        $latestRab = RabProject::query()
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (RabProject $project): array => [
                'name' => $project->customer_name,
                'code' => 'RAB-'.$project->created_at?->format('Ymd').'-'.str_pad((string) $project->id, 3, '0', STR_PAD_LEFT),
                'value' => $project->grand_total,
                'status' => $project->status,
            ]);

        $statusCounts = RabProject::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalRab' => $totalRab,
                'totalRabValue' => (int) $totalRabValue,
                'dealRabValue' => (int) $dealRabValue,
                'totalUsers' => $totalUsers,
                'thisMonthRab' => $thisMonthRab,
            ],
            'monthlyRab' => $monthlyRab,
            'latestRab' => $latestRab,
            'rabStatus' => collect(['Deal', 'Review', 'Draft', 'Batal'])
                ->map(fn (string $status): array => [
                    'label' => $status,
                    'value' => (int) ($statusCounts[$status] ?? 0),
                ]),
        ]);
    }
}
