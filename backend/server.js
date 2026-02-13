const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
