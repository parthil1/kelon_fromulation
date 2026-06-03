<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'benefits', 'ingredients', 
        'image_url', 'is_featured', 'flavours', 'packing_material', 
        'packing_size', 'shelf_life', 'moq', 'formulas'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'formulas' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
