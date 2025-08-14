# Crypto Price Visualization (MERN + Chart.js)

## Overview
This web application visualizes historical Bitcoin and Ethereum price data using interactive charts. It is built with the MERN stack (MongoDB, Express, React, Node.js) and uses Chart.js for rich, interactive plotting. The backend supports advanced MongoDB aggregation queries, including rolling averages and time series analytics, and the frontend provides a modern UI for exploring and comparing crypto price trends.

## Features
- **Interactive Charting**: Zoom, pan, and reset chart views with Chart.js.
- **Rolling Average**: Toggle a 10-day rolling average overlay for price smoothing.
- **Cluster Selection**: Switch between two MongoDB Atlas clusters (v6.x and v8.x) for performance and compatibility testing.
- **Raw Data Option**: For Bitcoin, toggle between time series and raw data collections.
- **Query Metadata**: View query execution time, document count, and response size for each request.
- **Rerun Query**: Instantly refresh the chart with the latest data and aggregation results.

## Why This App?
- **Performance Analysis**: Compare query performance and aggregation capabilities across MongoDB versions and collection types.
- **Data Exploration**: Easily visualize and analyze large volumes of crypto price data.
- **Modern Stack**: Demonstrates best practices for full-stack development with MERN and Chart.js.

## How to Run

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas clusters (with mock BTC/ETH data loaded)
- Python (for running data generation scripts)

### 1. Clone the Repository
```
git clone https://github.com/TJSlattery/chartsJsDemo.git
cd chartsJsDemo
```

### 2. Configure Environment Variables
Edit the `.env` file in the `server/` directory:
```
CLUSTER0_URI="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/crypto_db?w=1"
CLUSTER1_URI="mongodb+srv://<user>:<pass>@cluster1.mongodb.net/crypto_db?w=1"
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
