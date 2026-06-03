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
            'image' => 'nullable|image|max:2048'
        ]);

        if (!$request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        if (!$request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            if ($category->image_url && str_contains($category->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_url));
            }
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image_url && str_contains($category->image_url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $category->image_url));
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
