const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// show environment hints during development
console.log('NODE_ENV=', process.env.NODE_ENV || '<not set>');
console.log('JWT_SECRET set?', !!process.env.JWT_SECRET);
const postRoutes = require('./routes/postRoutes');
const refineRoutes = require('./routes/refineRoutes');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/refine', refineRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
