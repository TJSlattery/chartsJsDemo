// server/controllers/priceController.js

const { getClusterDb } = require('../config/db');

// Helper to get collection by symbol
function getCollection(symbol, useRaw) {
  if (symbol === 'BTC/USD' && useRaw === '1') return 'btc_raw';
  if (symbol === 'BTC/USD') return 'mock_btc_minutes';
  if (symbol === 'ETH/USD') return 'mock_eth_minutes';
  return 'mock_btc_minutes';
}

exports.getPrices = async (req, res) => {
  try {
    const { symbol, cluster, window, useRaw } = req.query;
    const collectionName = getCollection(symbol, useRaw);
    const db = getClusterDb(cluster);
    if (!db) {
      return res.status(503).json({ error: `MongoDB Cluster ${cluster} is unavailable.` });
    }
    const collection = db.collection(collectionName);
    // Aggregation pipeline: filter last 10 days, optionally 10-day rolling average
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    const pipeline = [
      {
        $match: {
          symbol: symbol,
          timestamp: {
            $gte: tenDaysAgo
          }
        }
      },
      { $sort: { timestamp: 1 } }
    ];
    if (window === '1') {
      pipeline.push({
        $setWindowFields: {
          sortBy: { timestamp: 1 },
          output: {
            avgPrice_10day: {
              $avg: "$close",
              window: {
                range: [-9, "current"],
                unit: "day"
              }
            }
          }
        }
      });
      pipeline.push({
        $project: {
          _id: 0,
          timestamp: 1,
          close: 1,
          avgPrice_10day: 1
        }
      });
    } else {
      pipeline.push({
        $project: {
          _id: 0,
          timestamp: 1,
          close: 1,
          avgPrice_10day: 1
        }
      });
    }
    // Print explain plan

    const explain = await collection.aggregate(pipeline).explain('executionStats');
    // Try to extract executionTimeMillis from various possible locations
    let explainExecTime = undefined;
    if (explain.executionStats && typeof explain.executionStats.executionTimeMillis === 'number') {
      explainExecTime = explain.executionStats.executionTimeMillis;
    } else if (Array.isArray(explain.stages)) {
      for (const stage of explain.stages) {
        if (stage.$cursor && stage.$cursor.executionStats && typeof stage.$cursor.executionStats.executionTimeMillis === 'number') {
          explainExecTime = stage.$cursor.executionStats.executionTimeMillis;
          break;
        }
      }
    }
    console.log('[MongoDB] Aggregation explain plan:', JSON.stringify(explain, null, 2));

    const start = Date.now();
    const data = await collection.aggregate(pipeline).toArray();
    const execTime = Date.now() - start;
    const sizeKB = Buffer.byteLength(JSON.stringify(data)) / 1024;
    console.log(`[MongoDB] Query execution time (Node wall): ${execTime} ms, MongoDB executionTimeMillis: ${explainExecTime} ms, Documents returned: ${data.length}, Response size: ${sizeKB.toFixed(2)} KB`);
    res.json({
      data,
      meta: {
        nodeWallTimeMs: execTime,
        mongoExecutionTimeMs: explainExecTime,
        documentsReturned: data.length,
        responseSizeKB: Number(sizeKB.toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
