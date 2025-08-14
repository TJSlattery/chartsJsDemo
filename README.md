# Crypto Price Visualization (MERN + Chart.js)

## Overview
This web application visualizes historical Bitcoin and Ethereum price data using interactive charts. It is built with the MERN stack (MongoDB, Express, React, Node.js) and uses Chart.js for interactive plotting. The backend supports MongoDB aggregation queries, including rolling averages and time series analytics.

## Features
- **Interactive Charting**: Zoom, pan, and reset chart views with Chart.js.
- **Rolling Average**: Toggle a 10-day rolling average overlay for price smoothing.
- **Cluster Selection**: Switch between two MongoDB Atlas clusters (v7.x and v8.x) for performance and compatibility testing.
- **Raw Data Option**: For Bitcoin, toggle between time series and raw data collections.
- **Query Metadata**: View query execution time, document count, and response size for each request.
- **Rerun Query**: Refresh the chart with the latest data and aggregation results.

## How to Run

### Prerequisites
- Node.js
- MongoDB Atlas clusters
- Python (for running data generation scripts)

### 1. Clone the Repository
```
git clone https://github.com/TJSlattery/chartsJsDemo.git
cd chartsJsDemo
```

### 2. Configure Environment Variables
Edit the `.env` file in the `server/` directory:
```
CLUSTER0_URI="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/crypto_db"
CLUSTER1_URI="mongodb+srv://<user>:<pass>@cluster1.mongodb.net/crypto_db"
PORT=8080
```

### 3. Generate Mock Data (Optional)
Run the Python scripts in the `data_generation_scripts/` folder to populate your clusters:
```
python data_generation_scripts/BTC.py
python data_generation_scripts/ETH.py
```

### 4. Install Dependencies
```
cd server && npm install
cd ../client && npm install
```

### 5. Start the Backend
```
cd ../server
npm start
```

### 6. Start the Frontend
```
cd ../client
npm start
```

### 7. Open the App
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Select BTC or ETH from the dropdown.
- Toggle between clusters and raw/timeseries data (BTC only).
- Enable/disable the rolling average overlay.
- Click "Rerun Query" to refresh the chart.
- View query performance and metadata above the chart.

## Project Structure
```
chartsJsDemo/
├── client/         # React frontend
├── server/         # Express backend
├── data_generation_scripts/ # Python scripts for mock data
├── README.md
```

## License
MIT

## Author
TJSlattery
