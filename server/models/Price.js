// server/models/Price.js
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  symbol: { type: String, required: true },
  low: Number,
  VolumeUSDT: Number,
  close: Number,
  tradecount: Number,
  open: Number,
  high: Number,
  VolumeBTC: Number,
  VolumeETH: Number
}, { collection: 'mock_btc_minutes', strict: false }); // For BTC, override for ETH in controller

module.exports = mongoose.model('Price', priceSchema);
