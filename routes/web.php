<?php

use App\Http\Controllers\RabProjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\PublicFormDashboardController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $cards = \App\Models\HomepageCard::where('is_active', true)->orderBy('order')->get();
    return Inertia::render('welcome', [
        'cards' => $cards,
    ]);
})->name('home');
Route::inertia('ongkir', 'ongkir')->name('ongkir');
Route::inertia('biaya', 'biaya')->name('biaya');
Route::inertia('form-beli', 'form-beli')->name('form-beli');
Route::post('form-beli', [PublicFormController::class, 'storePurchase'])->name('form-beli.store');
Route::inertia('tanya-jawab', 'tanya-jawab')->name('tanya-jawab');
Route::inertia('kontak', 'kontak')->name('kontak');
Route::inertia('rumah-citra-nusantara', 'rumah-citra-nusantara')->name('rumah-citra-nusantara');
Route::inertia('rumah-sudah-terbangun', 'rumah-sudah-terbangun')->name('rumah-sudah-terbangun');
Route::inertia('tahapan-pembangunan-rumah', 'tahapan-pembangunan-rumah')->name('tahapan-pembangunan-rumah');
Route::inertia('profil-perusahaan', 'profil-perusahaan')->name('profil-perusahaan');
Route::inertia('keuntungan-menggunakan-jasa-kami', 'keuntungan-menggunakan-jasa-kami')->name('keuntungan-menggunakan-jasa-kami');
Route::inertia('alur-kerjasama-pesanan', 'alur-kerjasama-pesanan')->name('alur-kerjasama-pesanan');
Route::inertia('spesifikasi-material-yang-dipakai', 'spesifikasi-material-yang-dipakai')->name('spesifikasi-material-yang-dipakai');
Route::inertia('skema-pembayaran', 'skema-pembayaran')->name('skema-pembayaran');

Route::get('rab-project', [RabProjectController::class, 'index'])->name('rab-project');
Route::post('rab-project', [RabProjectController::class, 'store'])->name('rab-project.store');
Route::patch('rab-project/{rabProject}', [RabProjectController::class, 'update'])->name('rab-project.update');
Route::patch('rab-project/{rabProject}/status', [RabProjectController::class, 'updateStatus'])->name('rab-project.status');
Route::delete('rab-project/{rabProject}', [RabProjectController::class, 'destroy'])->name('rab-project.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dashboard/pengajuan-pembelian', PublicFormDashboardController::class)->name('purchase-submissions');
    Route::patch('dashboard/pengajuan-pembelian/{purchaseForm}/akad', [PublicFormDashboardController::class, 'markAsAkad'])->name('purchase-submissions.akad');
    Route::get('dashboard/data-akad', [\App\Http\Controllers\DataAkadController::class, '__invoke'])->name('data-akad');
    Route::get('dashboard/master-data', [MasterDataController::class, 'index'])->name('master-data');
    Route::post('dashboard/master-data', [MasterDataController::class, 'store'])->name('master-data.store');
    Route::patch('dashboard/master-data/{masterDataItem}', [MasterDataController::class, 'update'])->name('master-data.update');
    Route::delete('dashboard/master-data/{masterDataItem}', [MasterDataController::class, 'destroy'])->name('master-data.destroy');
    Route::get('dashboard/user-management', [UserManagementController::class, 'index'])->name('user-management');
    Route::post('dashboard/user-management', [UserManagementController::class, 'store'])->name('user-management.store');
    Route::patch('dashboard/user-management/{user}', [UserManagementController::class, 'update'])->name('user-management.update');
    Route::delete('dashboard/user-management/{user}', [UserManagementController::class, 'destroy'])->name('user-management.destroy');

    Route::get('dashboard/homepage-settings', [\App\Http\Controllers\HomepageSettingController::class, 'index'])->name('homepage-settings');
    Route::post('dashboard/homepage-settings', [\App\Http\Controllers\HomepageSettingController::class, 'store'])->name('homepage-settings.store');
    Route::post('dashboard/homepage-settings/{card}', [\App\Http\Controllers\HomepageSettingController::class, 'update'])->name('homepage-settings.update');
    Route::delete('dashboard/homepage-settings/{card}', [\App\Http\Controllers\HomepageSettingController::class, 'destroy'])->name('homepage-settings.destroy');
});

require __DIR__.'/settings.php';
