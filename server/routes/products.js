const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Get all products with optional filtering by category
router.get('/', async (req, res) => {
  const { category_id, is_featured } = req.query;
  try {
    let query = db('products')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name');
      
    if (category_id) query = query.where({ 'products.category_id': category_id });
    if (is_featured) query = query.where({ 'products.is_featured': true });
    
    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await db('products')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .where('products.slug', slug)
      .first();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Create product (Admin only) with image upload
router.post('/', upload.single('image'), async (req, res) => {
  const { category_id, name, description, benefits, ingredients, is_featured, flavours, packing_material, packing_size, shelf_life, moq } = req.body;
  const slug = req.body.slug || generateSlug(name);
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
  
  try {
    const [id] = await db('products').insert({
      category_id, name, slug, description, benefits, ingredients, image_url, is_featured: is_featured === 'true',
      flavours, packing_material, packing_size, shelf_life, moq
    });
    res.status(201).json({ id, name, slug, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (Admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, benefits, ingredients, is_featured, flavours, packing_material, packing_size, shelf_life, moq } = req.body;
  const slug = req.body.slug || generateSlug(name);
  
  const updateData = {
    category_id, name, slug, description, benefits, ingredients, is_featured: is_featured === 'true',
    flavours, packing_material, packing_size, shelf_life, moq
  };

  if (req.file) {
    updateData.image_url = `/uploads/${req.file.filename}`;
  } else if (req.body.image_url) {
    updateData.image_url = req.body.image_url;
  }

  try {
    const updated = await db('products').where({ id }).update(updateData);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ id, ...updateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('products').where({ id }).del();
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
