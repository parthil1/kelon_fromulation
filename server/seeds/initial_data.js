const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('inquiries').del();
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del();

  const [testProdId] = await knex('categories').insert({ name: 'Testing', slug: 'testing' });
  const [prodId] = await knex('products').insert({ 
    category_id: testProdId, 
    name: 'Sample Product', 
    slug: 'sample', 
    description: 'test' 
  });

  await knex('inquiries').insert([
    { 
      product_id: prodId, 
      name: 'John Smith', 
      email: 'john@example.com', 
      phone: '1234567890', 
      message: 'I am interested in bulk ordering the Sample Product.'
    }
  ]);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await knex('users').insert([
    { username: 'admin', password: hashedPassword }
  ]);

  const categoriesData = [
    { name: 'Effervescent Tablets', slug: 'effervescent-tablets', description: 'Fast-dissolving tablets for quick absorption.' },
    { name: 'Standard Tablets', slug: 'standard-tablets', description: 'Precise dosing and coating options.' },
    { name: 'Capsules', slug: 'capsules', description: 'Premium quality hard and soft gel capsules.' },
    { name: 'Protein Powders', slug: 'protein-powders', description: 'High-purity, easy-mix formulations.' }
  ];

  for (const cat of categoriesData) {
    const [catId] = await knex('categories').insert(cat, ['id']);
    const categoryId = catId.id || catId;

    let products = [];
    if (cat.name === 'Effervescent Tablets') {
      products = [
        {
          name: 'Glutathione Effervescent Tablet',
          slug: 'glutathione-effervescent-tablet',
          description: 'Boosts the body\'s antioxidant defenses with Glutathione and Vitamin C.',
          benefits: 'Skin Brightening, Powerful Antioxidant, Immune Support, Anti-aging',
          ingredients: 'Glutathione 500mg, Vitamin C 40mg, Vitamin E 10mg, Hyaluronic Acid 20mg',
          flavours: 'Orange, Lemon, Watermelon, Strawberry',
          packing_material: 'Tube Pack, HDPE Bottle',
          packing_size: '15 Tab, 20 Tab, 30 Tab',
          shelf_life: '18 Months',
          moq: '2000 Tubes'
        },
        {
          name: 'ACV Effervescent Tablet',
          slug: 'acv-effervescent-tablet',
          description: 'Harness the power of ACV for weight management and digestive health.',
          benefits: 'Weight Management, Proper Digestion, Detoxification, Boost Metabolism',
          ingredients: 'Apple Cider Vinegar 500mg, Vitamin B12, Ginger Extract',
          flavours: 'Green Apple, Natural ACV',
          packing_material: 'Tube Pack',
          packing_size: '15 Tab, 20 Tab',
          shelf_life: '18 Months',
          moq: '3000 Tubes'
        }
      ];
    } else if (cat.name === 'Standard Tablets') {
      products = [
        { 
          name: 'Spirulina Tablets', 
          slug: 'spirulina-tablets', 
          description: 'Superfood supplement rich in protein and vitamins.',
          benefits: 'Superfood Nutrition, High Energy, Detoxification, Muscle Recovery',
          ingredients: 'Pure Spirulina Powder (Arthrospira platensis)',
          flavours: 'Natural',
          packing_material: 'HDPE Bottle',
          packing_size: '60 Tab, 120 Tab',
          shelf_life: '24 Months',
          moq: '1000 Bottles'
        }
      ];
    } else if (cat.name === 'Protein Powders') {
      products = [
        {
          name: 'Whey Protein Isolate',
          slug: 'whey-protein-isolate',
          description: 'Premium ultra-filtered whey protein for muscle growth.',
          benefits: 'Muscle Building, Fast Recovery, High Bioavailability',
          ingredients: 'Whey Protein Isolate, Soy Lecithin',
          flavours: 'Chocolate, Vanilla, Berry',
          packing_material: 'Jar, Pouch',
          packing_size: '1kg, 2kg',
          shelf_life: '24 Months',
          moq: '500 Jars'
        }
      ];
    }

    if (products.length > 0) {
      await knex('products').insert(products.map(p => ({ 
        ...p, 
        category_id: categoryId, 
        is_featured: true,
        image_url: `/uploads/${p.slug}.jpg` 
      })));
    }
  }
};
