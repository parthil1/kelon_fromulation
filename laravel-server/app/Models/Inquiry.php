<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'name', 'email', 'phone', 'message'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
