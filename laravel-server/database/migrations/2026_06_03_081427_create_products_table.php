<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('benefits')->nullable();
            $table->text('ingredients')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('flavours')->nullable();
            $table->string('packing_material')->nullable();
            $table->string('packing_size')->nullable();
            $table->string('shelf_life')->nullable();
            $table->string('moq')->nullable();
            $table->text('formulas')->nullable(); // JSON stored as text
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
