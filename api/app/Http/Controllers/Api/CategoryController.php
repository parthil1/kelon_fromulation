<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        unset($validated['image']);

        if (!$request->filled('slug')) {
            $validated['slug'] = $this->uniqueSlug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $category = Category::create($validated);
        $category->loadCount('products');

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        unset($validated['image']);

        if (!$request->filled('slug')) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $id);
        }

        if ($request->hasFile('image')) {
            if ($category->image_url && str_contains($category->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_url));
            }
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $category->update($validated);
        $category->loadCount('products');

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            return response()->json([
                'message' => 'Cannot delete a category that still has products. Move or delete those products first.',
            ], 422);
        }

        if ($category->image_url && str_contains($category->image_url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_url));
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $i = 1;

        while (
            Category::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }
}
