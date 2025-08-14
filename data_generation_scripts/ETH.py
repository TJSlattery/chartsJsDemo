import pymongo
from faker import Faker
from datetime import datetime, timedelta, timezone
import random
import os

# --- MongoDB Configuration ---
# Pull the connection string from the CLUSTER_URI environment variable
MONGO_URI = os.environ.get("CLUSTER1_URI")
DATABASE_NAME = "crypto_db"
COLLECTION_NAME = "btc_eth_merged" # New collection name for Ethereum data

# Initialize Faker
fake = Faker()

def create_time_series_collection(db):
    """
    Creates a time series collection with 'symbol' as the metaField and
    'minutes' as the granularity.
    """
    try:
        db.create_collection(
            COLLECTION_NAME,
            timeseries={
                "timeField": "timestamp",
                "metaField": "symbol",
                "granularity": "minutes"
            }
        )
        print(f"Time series collection '{COLLECTION_NAME}' created successfully.")
    except pymongo.errors.CollectionInvalid:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

def generate_and_insert_mock_data():
    """
    Generates mock Ethereum data for the past two years and inserts it.
    """
    if not MONGO_URI:
        print("Error: The environment variable 'CLUSTER_URI' is not set.")
        return

    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]

        create_time_series_collection(db)
        collection = db[COLLECTION_NAME]
        
        # Define the time range for the past two years (in minutes)
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=2 * 365) # Approx. 2 years
        current_date = start_date

        documents_to_insert = []
        
        # Start with a more realistic base price for ETH
        current_price = 2800.0  

        print(f"Generating mock data for the past two years...")

        while current_date <= end_date:
            # Simulate small price fluctuations around the previous close
            open_price = current_price + random.uniform(-5.0, 5.0)
            close_price = open_price + random.uniform(-10.0, 10.0)

            # Ensure high is always the highest and low is always the lowest
            high_price = max(open_price, close_price) + random.uniform(0, 3)
            low_price = min(open_price, close_price) - random.uniform(0, 3)

            # Generate other mock values
            volume_usdt = random.uniform(50000000, 200000000)
            trade_count = random.randint(50000, 150000)
            
            # Recalculate VolumeETH based on the simulated price
            volume_eth = volume_usdt / close_price

            document = {
                "timestamp": current_date,
                "symbol": "ETH/USD", # Your root-level symbol field for Ethereum
                "low": round(low_price, 2),
                "VolumeUSDT": round(volume_usdt, 2),
                "close": round(close_price, 2),
                "tradecount": trade_count,
                "open": round(open_price, 2),
                "high": round(high_price, 2),
                "VolumeETH": round(volume_eth, 8)
            }
            documents_to_insert.append(document)
            
            # Update the current price for the next minute's calculation
            current_price = close_price
            current_date += timedelta(minutes=1)

            # Insert in chunks to manage memory
            if len(documents_to_insert) >= 5000:
                collection.insert_many(documents_to_insert)
                print(f"Inserted a batch of {len(documents_to_insert)} documents.")
                documents_to_insert = []
        
        # Insert any remaining documents
        if documents_to_insert:
            collection.insert_many(documents_to_insert)
            print(f"Inserted the final batch of {len(documents_to_insert)} documents.")

        print("Mock data generation and insertion complete. ✅")

    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    generate_and_insert_mock_data()