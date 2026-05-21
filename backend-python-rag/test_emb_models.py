import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

print("--- Testing gemini-embedding-001 ---")
try:
    res = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents="This is a test legal document chunk for NyayaMitra.",
        config={"task_type": "RETRIEVAL_DOCUMENT"}
    )
    print("gemini-embedding-001 dimension:", len(res.embeddings[0].values))
except Exception as e:
    print("gemini-embedding-001 failed:", e)

print("\n--- Testing gemini-embedding-2 ---")
try:
    res = client.models.embed_content(
        model="models/gemini-embedding-2",
        contents="This is a test legal document chunk for NyayaMitra.",
        config={"task_type": "RETRIEVAL_DOCUMENT"}
    )
    print("gemini-embedding-2 default dimension:", len(res.embeddings[0].values))
except Exception as e:
    print("gemini-embedding-2 failed:", e)

print("\n--- Testing gemini-embedding-2 with output_dimensionality=768 ---")
try:
    res = client.models.embed_content(
        model="models/gemini-embedding-2",
        contents="This is a test legal document chunk for NyayaMitra.",
        config={
            "task_type": "RETRIEVAL_DOCUMENT",
            "output_dimensionality": 768
        }
    )
    print("gemini-embedding-2 with output_dimensionality=768 dimension:", len(res.embeddings[0].values))
except Exception as e:
    print("gemini-embedding-2 with output_dimensionality=768 failed:", e)
