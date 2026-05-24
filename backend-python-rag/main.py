from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NyayaMitra RAG Service",
    description="Python microservice for Legal Document RAG using ChromaDB and Gemini.",
    version="1.0.0"
)

# Allow requests from the frontend
frontend_url = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from routers import ingest, search
app.include_router(ingest.router)
app.include_router(search.router)

class PingResponse(BaseModel):
    status: str
    message: str

@app.get("/ping", response_model=PingResponse, tags=["Health"])
async def ping():
    """
    Health check endpoint to verify communication between Spring Boot and FastAPI.
    """
    return {"status": "ok", "message": "NyayaMitra Python RAG Service is up and running!"}

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
