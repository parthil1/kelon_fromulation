const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit inquiry
router.post('/', async (req, res) => {
  const { product_id, name, email, phone, message } = req.body;
  try {
    const [id] = await db('inquiries').insert({
      product_id, name, email, phone, message
    });
    res.status(201).json({ id, message: 'Inquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all inquiries (Admin only)
router.get('/', async (req, res) => {
  try {
    const inquiries = await db('inquiries')
      .leftJoin('products', 'inquiries.product_id', 'products.id')
      .select('inquiries.*', 'products.name as product_name');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
