import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

print("--- Inspecting new google.genai Client ---")
try:
    from google import genai
    from google.genai import types

    # Initialize client
    client = genai.Client(api_key=api_key)
    print("Client initialized successfully.")
    
    print("\nListing models supporting 'embedContent':")
    for m in client.models.list():
        # Check if embedContent is in supported methods
        if any("embedContent" in method for method in getattr(m, "supported_generation_methods", [])):
            print(f"- {m.name} ({m.display_name})")
            print(f"  Supported methods: {m.supported_generation_methods}")
            print(f"  Version: {getattr(m, 'version', 'N/A')}")
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n--- Listing ALL models returned by client ---")
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    for m in client.models.list():
        print(f"- Name: {m.name}, Display: {m.display_name}")
except Exception as e:
    import traceback
    traceback.print_exc()
