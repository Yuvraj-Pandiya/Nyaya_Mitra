import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

print("--- Testing Legacy google-generativeai SDK with output_dimensionality ---")
try:
    res = genai.embed_content(
        model="models/gemini-embedding-2",
        content="Hello world from NyayaMitra",
        task_type="RETRIEVAL_DOCUMENT",
        # Some older versions might take it directly, or in kwargs, or it might not be supported
    )
    print("Default call success. Length:", len(res['embedding']))
except Exception as e:
    print("Default call failed:", e)

try:
    res = genai.embed_content(
        model="models/gemini-embedding-2",
        content="Hello world from NyayaMitra",
        task_type="RETRIEVAL_DOCUMENT",
        output_dimensionality=768
    )
    print("output_dimensionality=768 call success. Length:", len(res['embedding']))
except Exception as e:
    print("output_dimensionality=768 call failed:", e)
