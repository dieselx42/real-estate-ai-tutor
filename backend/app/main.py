from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
import logging
from dotenv import load_dotenv

# Import routers
from routes.questions import router as questions_router
from routes.progress import router as progress_router
from routes.users import router as users_router
from routes.ai import router as ai_router
from routes.sessions import router as sessions_router

# Load environment variables
load_dotenv()

# Open API Key
openai.api_key = os.getenv("OPENAI_API_KEY")  # ✅ Set API Key

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI(title="Real Estate AI Tutor API", description="API for AI-based real estate exam prep")


# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root Endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate AI Tutor API!"}


# ✅ Health Check Endpoint
@app.get("/api/health-check", tags=["General"])
def health_check():
    return {"status": "OK", "message": "Backend is running successfully!"}

# ✅ Data Endpoint
@app.get("/api/data")
def get_data():
    return {"message": "API is working", "data": "Sample backend data"}

# ✅ Register API Routes
app.include_router(questions_router, prefix="/api/questions", tags=["Questions"])
app.include_router(progress_router, prefix="/api/progress", tags=["Progress"])
app.include_router(users_router, prefix="/api/user-progress", tags=["User Progress"])
app.include_router(ai_router, prefix="/api/ai-recommendations", tags=["AI"])
app.include_router(sessions_router, prefix="/api/upcoming-sessions", tags=["Sessions"])
