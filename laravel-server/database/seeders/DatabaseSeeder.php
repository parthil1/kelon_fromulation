<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable foreign key checks for truncation
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Deletes ALL existing entries
        Inquiry::truncate();
        Product::truncate();
        Category::truncate();
        User::truncate();

        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
        ]);

        // Sample Data
        $testingCategory = Category::create([
            'name' => 'Testing',
            'slug' => 'testing',
            'description' => 'Test Category'
        ]);

        $sampleProduct = Product::create([
            'category_id' => $testingCategory->id,
            'name' => 'Sample Product',
            'slug' => 'sample',
            'description' => 'test'
        ]);

        Inquiry::create([
            'product_id' => $sampleProduct->id,
            'name' => 'John Smith',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'message' => 'I am interested in bulk ordering the Sample Product.'
        ]);

        $categoriesData = [
            [
                'name' => 'Effervescent Tablets',
                'slug' => 'effervescent-tablets',
                'description' => 'Fast-dissolving tablets for quick absorption.',
                'products' => [
                    [
                        'name' => 'Glutathione Effervescent Tablet',
                        'slug' => 'glutathione-effervescent-tablet',
                        'description' => 'Boosts the body\'s antioxidant defenses with Glutathione and Vitamin C.',
                        'benefits' => 'Skin Brightening, Powerful Antioxidant, Immune Support, Anti-aging',
                        'ingredients' => 'Glutathione 500mg, Vitamin C 40mg, Vitamin E 10mg, Hyaluronic Acid 20mg',
                        'flavours' => 'Orange, Lemon, Watermelon, Strawberry',
                        'packing_material' => 'Tube Pack, HDPE Bottle',
                        'packing_size' => '15 Tab, 20 Tab, 30 Tab',
                        'shelf_life' => '18 Months',
                        'moq' => '2000 Tubes'
                    ],
                    [
                        'name' => 'ACV Effervescent Tablet',
                        'slug' => 'acv-effervescent-tablet',
                        'description' => 'Harness the power of ACV for weight management and digestive health.',
                        'benefits' => 'Weight Management, Proper Digestion, Detoxification, Boost Metabolism',
                        'ingredients' => 'Apple Cider Vinegar 500mg, Vitamin B12, Ginger Extract',
                        'flavours' => 'Green Apple, Natural ACV',
                        'packing_material' => 'Tube Pack',
                        'packing_size' => '15 Tab, 20 Tab',
                        'shelf_life' => '18 Months',
                        'moq' => '3000 Tubes'
                    ]
                ]
            ],
            [
                'name' => 'Standard Tablets',
                'slug' => 'standard-tablets',
                'description' => 'Precise dosing and coating options.',
                'products' => [
                    [
                        'name' => 'Spirulina Tablets',
                        'slug' => 'spirulina-tablets',
                        'description' => 'Superfood supplement rich in protein and vitamins.',
                        'benefits' => 'Superfood Nutrition, High Energy, Detoxification, Muscle Recovery',
                        'ingredients' => 'Pure Spirulina Powder (Arthrospira platensis)',
                        'flavours' => 'Natural',
                        'packing_material' => 'HDPE Bottle',
                        'packing_size' => '60 Tab, 120 Tab',
                        'shelf_life' => '24 Months',
                        'moq' => '1000 Bottles'
                    ]
                ]
            ],
            [
                'name' => 'Capsules',
                'slug' => 'capsules',
                'description' => 'Premium quality hard and soft gel capsules.',
                'products' => []
            ],
            [
                'name' => 'Protein Powders',
                'slug' => 'protein-powders',
                'description' => 'High-purity, easy-mix formulations.',
                'products' => [
                    [
                        'name' => 'Whey Protein Isolate',
                        'slug' => 'whey-protein-isolate',
                        'description' => 'Premium ultra-filtered whey protein for muscle growth.',
                        'benefits' => 'Muscle Building, Fast Recovery, High Bioavailability',
                        'ingredients' => 'Whey Protein Isolate, Soy Lecithin',
                        'flavours' => 'Chocolate, Vanilla, Berry',
                        'packing_material' => 'Jar, Pouch',
                        'packing_size' => '1kg, 2kg',
                        'shelf_life' => '24 Months',
                        'moq' => '500 Jars'
                    ]
                ]
            ]
        ];

        foreach ($categoriesData as $catData) {
            $products = $catData['products'];
            unset($catData['products']);
            
            $category = Category::create($catData);

            foreach ($products as $pData) {
                $pData['category_id'] = $category->id;
                $pData['is_featured'] = true;
                $pData['image_url'] = "/storage/uploads/{$pData['slug']}.jpg";
                Product::create($pData);
            }
        }
    }
}
