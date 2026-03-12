from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date

# ── Auth ──────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ── User Profile ──────────────────────────────────
class PillarModel(BaseModel):
    id: str
    name: str
    hours: float
    description: Optional[str] = ""
    icon: Optional[str] = "⚡"
    color: Optional[str] = "#c8a84b"

class UserProfileRequest(BaseModel):
    why: str
    day_one: Optional[str] = ""
    reset_hour: Optional[int] = 0
    pillars: List[PillarModel]
    start_date: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    email: str
    why: Optional[str] = ""
    day_one: Optional[str] = ""
    reset_hour: Optional[int] = 0
    pillars: Optional[List[dict]] = []
    start_date: Optional[str] = None
    onboarded: Optional[bool] = False

# ── Daily Log ─────────────────────────────────────
class DailyLogRequest(BaseModel):
    log_date: str  # YYYY-MM-DD
    done: Optional[List[str]] = []
    void_reason: Optional[str] = None

class DailyLogResponse(BaseModel):
    log_date: str
    done: List[str]
    void_reason: Optional[str] = None

# ── Journal ───────────────────────────────────────
class JournalEntryRequest(BaseModel):
    log_date: str       # YYYY-MM-DD
    pillar_id: str
    content: str

class JournalEntryResponse(BaseModel):
    id: str
    log_date: str
    pillar_id: str
    content: str
    locked: bool
    created_at: str

# ── Pillar Archive ────────────────────────────────
class ArchiveResponse(BaseModel):
    pillar_id: str
    entries: List[dict]
