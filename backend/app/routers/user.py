from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import UserProfileRequest, UserProfileResponse
from app.config import get_supabase, get_current_user
from datetime import date
import json

router = APIRouter()

@router.get("/me", response_model=UserProfileResponse)
def get_me(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    u = result.data[0]
    return UserProfileResponse(
        id=u["id"],
        email=u["email"],
        why=u.get("why", ""),
        day_one=u.get("day_one", ""),
        reset_hour=u.get("reset_hour", 0),
        pillars=u.get("pillars", []),
        start_date=u.get("start_date"),
        onboarded=u.get("onboarded", False),
    )

@router.post("/onboard", response_model=UserProfileResponse)
def onboard(body: UserProfileRequest, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    start = body.start_date or str(date.today())
    pillars_data = [p.model_dump() for p in body.pillars]

    result = sb.table("users").update({
        "why": body.why,
        "day_one": body.day_one,
        "reset_hour": body.reset_hour,
        "pillars": pillars_data,
        "start_date": start,
        "onboarded": True,
    }).eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save profile")

    u = result.data[0]
    return UserProfileResponse(
        id=u["id"],
        email=u["email"],
        why=u.get("why", ""),
        day_one=u.get("day_one", ""),
        reset_hour=u.get("reset_hour", 0),
        pillars=u.get("pillars", []),
        start_date=u.get("start_date"),
        onboarded=u.get("onboarded", False),
    )

@router.put("/settings", response_model=UserProfileResponse)
def update_settings(body: UserProfileRequest, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    pillars_data = [p.model_dump() for p in body.pillars]

    result = sb.table("users").update({
        "why": body.why,
        "reset_hour": body.reset_hour,
        "pillars": pillars_data,
    }).eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update settings")

    u = result.data[0]
    return UserProfileResponse(
        id=u["id"],
        email=u["email"],
        why=u.get("why", ""),
        day_one=u.get("day_one", ""),
        reset_hour=u.get("reset_hour", 0),
        pillars=u.get("pillars", []),
        start_date=u.get("start_date"),
        onboarded=u.get("onboarded", False),
    )
