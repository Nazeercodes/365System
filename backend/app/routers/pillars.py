from fastapi import APIRouter, Depends, HTTPException
from app.config import get_supabase, get_current_user

router = APIRouter()

@router.get("/")
def get_pillars(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("users").select("pillars").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"pillars": result.data[0].get("pillars", [])}
