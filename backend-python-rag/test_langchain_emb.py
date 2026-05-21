import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

print("--- Testing LangChain GoogleGenerativeAIEmbeddings with models/gemini-embedding-2 ---")
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        google_api_key=api_key,
        task_type="RETRIEVAL_DOCUMENT",
    )
    res = embeddings.embed_query("Hello world from NyayaMitra")
    print("Success! Embedding length:", len(res))
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n--- Testing LangChain with models/gemini-embedding-2 and output_dimensionality=768 ---")
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        google_api_key=api_key,
        task_type="RETRIEVAL_DOCUMENT",
        # Check if output_dimensionality can be passed directly or in client_options/config
    )
    # Let's inspect the initialization parameters or try passing it to constructor if supported
    # In some versions of langchain_google_genai, it has optional kwargs or custom attributes.
    print("Initialization signature and attributes:")
    print("embeddings.__dict__:", {k: v for k, v in embeddings.__dict__.items() if k != 'client'})
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n--- Try initializing with output_dimensionality in constructor ---")
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        google_api_key=api_key,
        task_type="RETRIEVAL_DOCUMENT",
        output_dimensionality=768
    )
    res = embeddings.embed_query("Hello world from NyayaMitra")
    print("Success with output_dimensionality=768! Embedding length:", len(res))
except Exception as e:
    print("Failed to initialize/run with output_dimensionality in constructor:", e)
