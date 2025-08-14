// client/src/components/PriceChart.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);


function PriceChart({ symbol, cluster, windowFn, useRaw }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  // Prevent horizontal scroll while dragging to zoom or pan
  const [isDragging, setIsDragging] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const chartRef = useRef();

  useEffect(() => {
    setLoading(true);
    setMeta(null);
    axios.get(`/api/prices?symbol=${symbol}&limit=1000&cluster=${cluster}&window=${windowFn}&useRaw=${useRaw}`)
      .then(res => {
        const { data, meta } = res.data;
        setMeta(meta);
        const baseDataset = {
          label: `${symbol} Close Price`,
          data: data.map(d => d.close),
          borderColor: symbol === 'BTC/USD' ? 'orange' : 'blue',
          backgroundColor: function(ctx) {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return null;
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, symbol === 'BTC/USD' ? 'rgba(255,165,0,0.3)' : 'rgba(0,0,255,0.3)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            return gradient;
          },
          tension: 0.2,
          pointRadius: 0,
          fill: true,
        };
        const avgDataset = {
          label: '10-Day Avg',
          data: data.map(d => d.avgPrice_10day),
          borderColor: '#888',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
          spanGaps: true,
          borderDash: [6, 6],
          fill: false,
        };
        setChartData({
          labels: data.map(d => {
            const dt = new Date(d.timestamp);
            return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }),
          datasets: windowFn ? [baseDataset, avgDataset] : [baseDataset]
        });
        setLoading(false);
      });
  }, [symbol, cluster, windowFn, useRaw, refreshKey]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${symbol} Price (last 10 days)` },
      zoom: {
        zoom: {
          drag: { enabled: true },
          mode: 'x',
          onZoomStart: () => {
            setIsDragging(true);
          },
          onZoomComplete: () => {
            setIsDragging(false);
          },
        },
        pan: {
          enabled: true,
          mode: 'x',
          onPanStart: () => {
            setIsDragging(true);
          },
          onPanComplete: () => {
            setIsDragging(false);
          },
        },
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        position: 'nearest',
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y != null) label += context.parsed.y.toLocaleString();
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: false },
        grid: { display: false },
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        display: true,
        title: { display: true, text: 'Price (USD)' },
        grid: { display: true }
      }
    }
  }), [symbol]);


  if (loading) return <div>Loading chart...</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div>
      {meta && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: 8,
          padding: '10px 18px',
          marginBottom: 16,
          color: '#333',
          fontSize: 15,
          display: 'flex',
          gap: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <span><b>Node Wall Time:</b> {meta.nodeWallTimeMs} ms</span>
          <span><b>MongoDB Exec Time:</b> {meta.mongoExecutionTimeMs ?? 'N/A'} ms</span>
          <span><b>Docs:</b> {meta.documentsReturned}</span>
          <span><b>Size:</b> {meta.responseSizeKB} KB</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #bbb', background: '#f5f5f5', cursor: 'pointer', fontWeight: 500 }}
        >
          Rerun Query
        </button>
        <button
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.resetZoom();
            }
          }}
          style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #bbb', background: '#f5f5f5', cursor: 'pointer', fontWeight: 500 }}
        >
          Reset Zoom
        </button>
      </div>
      <div
        style={{ width: '100%', overflowX: isDragging ? 'hidden' : 'auto' }}
      >
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          height={400}
        />
      </div>
    </div>
  );
}

export default PriceChart;