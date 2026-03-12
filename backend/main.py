from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routers import auth, user, pillars, journal, daily

app = FastAPI(
    title="365System API",
    description="Personal Operating System — Everyone has goals. Few have systems.",
    version="1.0.0"
)

# CORS
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "https://*.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(pillars.router, prefix="/pillars", tags=["Pillars"])
app.include_router(journal.router, prefix="/journal", tags=["Journal"])
app.include_router(daily.router, prefix="/daily", tags=["Daily"])

@app.get("/")
def root():
    return {
        "app": "365System",
        "tagline": "Everyone has goals. Few have systems.",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
