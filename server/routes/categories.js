const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories with product count
router.get('/', async (req, res) => {
  try {
    const categories = await db('categories')
      .leftJoin('products', 'categories.id', 'products.category_id')
      .select('categories.*')
      .count('products.id as product_count')
      .groupBy('categories.id');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create category (Admin only - middleware can be added later)
router.post('/', async (req, res) => {
  const { name, slug, description, image_url } = req.body;
  try {
    const [id] = await db('categories').insert({ name, slug, description, image_url });
    res.status(201).json({ id, name, slug, description, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
