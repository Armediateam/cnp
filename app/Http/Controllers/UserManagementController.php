<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Show the user management page.
     */
    public function index(): Response
    {
        return Inertia::render('user-management', [
            'users' => User::query()
                ->latest()
                ->get()
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->email_verified_at ? 'Verified' : 'Unverified',
                    'createdAt' => $user->created_at?->format('d M Y'),
                ]),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil dibuat.']);

        return to_route('user-management');
    }

    /**
     * Update the user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $user->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil diperbarui.']);

        return to_route('user-management');
    }

    /**
     * Delete the user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->is($user)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'User aktif tidak bisa dihapus.']);

            return to_route('user-management');
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil dihapus.']);

        return to_route('user-management');
    }
}
