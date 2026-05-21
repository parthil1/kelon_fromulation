const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const authRoutes = require('./routes/auth');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Nutralike Clone API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
