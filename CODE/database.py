import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if not url or not key or "PASTE" in key:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY is missing in .env")
    supabase: Client = None
else:
    supabase: Client = create_client(url, key)

def get_supabase_client() -> Client:
    return supabase

# Example function to check connection
def check_connection():
    if supabase:
        try:
            res = supabase.table("neighborhood_roster").select("*").limit(1).execute()
            print("Successfully connected to Supabase!")
            return True
        except Exception as e:
            print(f"Connection failed: {e}")
            return False
    return False
