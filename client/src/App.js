// client/src/App.js
import React, { useState } from 'react';
import PriceChart from './components/PriceChart';

function App() {
  const [symbol, setSymbol] = useState('BTC/USD');
  const [useCluster0, setUseCluster0] = useState(false);
  const [showWindow, setShowWindow] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Crypto Price Visualization (MERN + Chart.js)</h1>
      <div style={{ marginBottom: 12 }}>
        <select value={symbol} onChange={e => setSymbol(e.target.value)}>
          <option value="BTC/USD">BTC/USD</option>
          <option value="ETH/USD">ETH/USD</option>
        </select>
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={useCluster0}
            onChange={e => setUseCluster0(e.target.checked)}
          />
          {' '}Use MongoDB 8.0 Cluster
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={showWindow}
            onChange={e => setShowWindow(e.target.checked)}
          />
          {' '}Show 10-day Rolling Average
        </label>
      </div>
      <PriceChart symbol={symbol} cluster={useCluster0 ? 0 : 1} windowFn={showWindow ? 1 : 0} />
    </div>
  );
}

export default App;
