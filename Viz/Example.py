import pymongo
import pandas as pd
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta, timezone

# --- MongoDB Configuration ---
# Pull the connection string from the CLUSTER_URI environment variable
MONGO_URI = os.environ.get("CLUSTER1_URI")
DATABASE_NAME = "crypto_db"
COLLECTION_NAME = "mock_eth_minutes"

def visualize_data():
    """
    Connects to MongoDB, fetches the last 30 days of ETH data, and
    creates a line chart of the closing price.
    """
    if not MONGO_URI:
        print("Error: The environment variable 'CLUSTER_URI' is not set.")
        return

    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Define the time range for the last 30 days
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=30)

        print(f"Fetching data from '{COLLECTION_NAME}' for the last 30 days...")
        
        # Use an aggregation pipeline to filter data and select fields
        pipeline = [
            {"$match": {"timestamp": {"$gte": start_date, "$lte": end_date}}},
            {"$project": {"_id": 0, "timestamp": 1, "close": 1}}
        ]
        
        cursor = collection.aggregate(pipeline)
        
        # Load the data into a pandas DataFrame
        df = pd.DataFrame(list(cursor))
        
        if df.empty:
            print("No data found for the specified period.")
            return

        # Ensure the timestamp column is a datetime object and set it as the index
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.set_index('timestamp').sort_index()

        # Create the line plot
        plt.style.use('seaborn-v0_8-whitegrid')
        
        plt.figure(figsize=(14, 7))
        df['close'].plot(color='royalblue', linewidth=1.5)
        
        plt.title('ETH/USD Price Over the Last 30 Days (Mock Data)', fontsize=16)
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Closing Price (USD)', fontsize=12)
        plt.grid(True, linestyle='--', alpha=0.6)
        
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save the plot to a file
        output_filename = 'eth_price_chart.png'
        plt.savefig(output_filename)
        print(f"Chart saved to {output_filename}")
        
    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    visualize_data()