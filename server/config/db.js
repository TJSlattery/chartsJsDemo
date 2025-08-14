// server/config/db.js
const { MongoClient } = require('mongodb');
let client1 = null; //MDB v. 7.0
let client0 = null; //MDB v. 8.0
let db1 = null;
let db0 = null;

async function connectAllClusters() {
  if (!client1) {
    try {
      client1 = new MongoClient(process.env.CLUSTER1_URI);
      await client1.connect();
      db1 = client1.db('crypto_db');
      console.log('Connected to MongoDB Cluster1');
    } catch (err) {
      db1 = null;
      console.warn('Warning: Could not connect to MongoDB Cluster1:', err.message);
    }
  }
  if (!client0) {
    try {
      client0 = new MongoClient(process.env.CLUSTER0_URI);
      await client0.connect();
      db0 = client0.db('crypto_db');
      console.log('Connected to MongoDB Cluster0');
    } catch (err) {
      db0 = null;
      console.warn('Warning: Could not connect to MongoDB Cluster0:', err.message);
    }
  }
}

module.exports = {
  connectAllClusters,
  getClusterDb: (cluster) => (cluster === '0' ? db0 : db1),
};
