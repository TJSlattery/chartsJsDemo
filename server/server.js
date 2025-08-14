// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectAllClusters } = require('./controllers/priceController');

const app = express();
app.use(cors());
app.use(express.json());



// Connect to all MongoDB clusters at startup
connectAllClusters();

// Simple test route
app.get('/test', (req, res) => res.send('Test route working'));

app.use('/api/prices', require('./routes/priceRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
