from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, profile, goals, portfolio

# Create all DB tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WealthPilot AI",
    description="Wealth Management API",
    version="1.0.0"
)

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(goals.router)
app.include_router(portfolio.router)


@app.get("/")
def root():
    return {"message": "WealthPilot AI API is running"}
