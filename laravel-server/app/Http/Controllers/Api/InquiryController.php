<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index()
    {
        $inquiries = Inquiry::with('product')->orderBy('created_at', 'desc')->get();
        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'nullable|string'
        ]);

        $inquiry = Inquiry::create($validated);
        return response()->json($inquiry, 201);
    }

    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
