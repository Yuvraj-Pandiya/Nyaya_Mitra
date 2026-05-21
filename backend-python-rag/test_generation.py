import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

print("--- Testing Legacy google-generativeai SDK Generation ---")
import google.generativeai as genai
genai.configure(api_key=api_key)

generation_models = [
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-2.0-flash",
    "models/gemini-2.0-flash",
    "gemini-2.5-flash",
    "models/gemini-2.5-flash",
    "gemini-3.5-flash",
    "models/gemini-3.5-flash",
    "gemini-flash-latest",
    "models/gemini-flash-latest"
]

for model in generation_models:
    try:
        print(f"\nTesting legacy model: '{model}'")
        gmodel = genai.GenerativeModel(model)
        res = gmodel.generate_content("Hello! Give me a one-word answer.")
        print(f"  SUCCESS! Response: {res.text.strip()}")
    except Exception as e:
        print(f"  FAILED for '{model}': {e}")

print("\n--- Testing New google.genai SDK Generation ---")
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    for model in ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-3.5-flash"]:
        try:
            print(f"\nTesting new SDK model: '{model}'")
            res = client.models.generate_content(
                model=model,
                contents="Hello! Give me a one-word answer."
            )
            print(f"  SUCCESS! Response: {res.text.strip()}")
        except Exception as e:
            print(f"  FAILED for '{model}': {e}")
except Exception as e:
    print("New SDK test failed:", e)
