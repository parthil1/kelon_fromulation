<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('search')) {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $limit = $request->get('limit', 10);
        $products = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json([
            'data' => $products->items(),
            'total' => $products->total(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage()
        ]);
    }

    public function show($slug)
    {
        $product = Product::with('category')->where('slug', $slug)->firstOrFail();
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'description' => 'nullable|string',
            'benefits' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'nullable',
            'flavours' => 'nullable|string',
            'packing_material' => 'nullable|string',
            'packing_size' => 'nullable|string',
            'shelf_life' => 'nullable|string',
            'moq' => 'nullable|string',
            'formulas' => 'nullable'
        ]);

        if (!$request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads'), $filename);
            $validated['image_url'] = '/uploads/' . $filename;
        }

        $validated['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug,' . $id,
            'description' => 'nullable|string',
            'benefits' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'nullable',
            'flavours' => 'nullable|string',
            'packing_material' => 'nullable|string',
            'packing_size' => 'nullable|string',
            'shelf_life' => 'nullable|string',
            'moq' => 'nullable|string',
            'formulas' => 'nullable'
        ]);

        if (!$request->filled('slug')) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image_url) {
                if (str_contains($product->image_url, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
                } elseif (str_contains($product->image_url, '/uploads/')) {
                    $oldPath = public_path(str_replace('/uploads/', 'uploads/', $product->image_url));
                    if (file_exists($oldPath)) {
                        @unlink($oldPath);
                    }
                }
            }
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads'), $filename);
            $validated['image_url'] = '/uploads/' . $filename;
        } elseif ($request->has('image_url') && empty($request->input('image_url'))) {
            // Delete old image if it was removed in frontend
            if ($product->image_url) {
                if (str_contains($product->image_url, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
                } elseif (str_contains($product->image_url, '/uploads/')) {
                    $oldPath = public_path(str_replace('/uploads/', 'uploads/', $product->image_url));
                    if (file_exists($oldPath)) {
                        @unlink($oldPath);
                    }
                }
            }
            $validated['image_url'] = null;
        }

        $validated['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image_url) {
            if (str_contains($product->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
            } elseif (str_contains($product->image_url, '/uploads/')) {
                $oldPath = public_path(str_replace('/uploads/', 'uploads/', $product->image_url));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
