from fastapi import APIRouter, HTTPException
from app.models.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.config import get_supabase, hash_password, verify_password, create_access_token
import uuid

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest):
    sb = get_supabase()

    # Check if user exists
    existing = sb.table("users").select("id").eq("email", body.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user_id = str(uuid.uuid4())
    hashed = hash_password(body.password)

    result = sb.table("users").insert({
        "id": user_id,
        "email": body.email,
        "password_hash": hashed,
        "onboarded": False,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    token = create_access_token({"sub": user_id})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    sb = get_supabase()

    result = sb.table("users").select("*").eq("email", body.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = result.data[0]
    if not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["id"]})
    return TokenResponse(access_token=token)
