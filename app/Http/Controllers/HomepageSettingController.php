<?php

namespace App\Http\Controllers;

use App\Models\HomepageCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomepageSettingController extends Controller
{
    public function index()
    {
        $cards = HomepageCard::orderBy('order')->get();
        return Inertia::render('admin/homepage-settings', [
            'cards' => $cards,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'order' => 'required|integer',
            'is_active' => 'boolean',
            'image' => 'required|image|max:2048',
        ]);

        $imagePath = $request->file('image')->store('homepage', 'public');

        HomepageCard::create([
            'title' => $validated['title'],
            'url' => $validated['url'],
            'order' => $validated['order'],
            'is_active' => $request->boolean('is_active', true),
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Card created successfully.');
    }

    public function update(Request $request, HomepageCard $card)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'order' => 'required|integer',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = [
            'title' => $validated['title'],
            'url' => $validated['url'],
            'order' => $validated['order'],
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->hasFile('image')) {
            if ($card->image_path) {
                Storage::disk('public')->delete($card->image_path);
            }
            $data['image_path'] = $request->file('image')->store('homepage', 'public');
        }

        $card->update($data);

        return back()->with('success', 'Card updated successfully.');
    }

    public function destroy(HomepageCard $card)
    {
        if ($card->image_path) {
            Storage::disk('public')->delete($card->image_path);
        }
        $card->delete();

        return back()->with('success', 'Card deleted successfully.');
    }
}
