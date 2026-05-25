from supabase import create_client, Client
import os
from dotenv import load_dotenv


load_dotenv()

url: str | None = os.getenv("DB_URL")
key: str | None = os.getenv("SUPABASE_KEY")


def get_supabase_client() -> Client:
    if not url or not key:
        raise RuntimeError("DB_URL and SUPABASE_KEY must be set")

    return create_client(url, key)
