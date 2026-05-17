import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Connection details from .env
db_url = os.getenv("DATABASE_URL")

def apply_schema():
    if not db_url or "PASSWORD" in db_url:
        print("Error: DATABASE_URL is not correctly configured in .env")
        return

    try:
        # Connect to the PostgreSQL database
        print("Connecting to Supabase PostgreSQL...")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # Read the schema.sql file
        print("Reading schema.sql...")
        with open("schema.sql", "r") as f:
            schema_sql = f.read()

        # Execute the SQL
        print("Executing schema... This may take a few seconds.")
        cur.execute(schema_sql)
        
        # Commit the changes
        conn.commit()
        print("SUCCESS: Database schema applied successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"FAILED to apply schema: {e}")

if __name__ == "__main__":
    apply_schema()
