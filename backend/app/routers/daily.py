from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import DailyLogRequest, DailyLogResponse
from app.config import get_supabase, get_current_user
from datetime import date

router = APIRouter()

@router.get("/{log_date}", response_model=DailyLogResponse)
def get_daily(log_date: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("daily_logs") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("log_date", log_date) \
        .execute()

    if not result.data:
        return DailyLogResponse(log_date=log_date, done=[], void_reason=None)

    d = result.data[0]
    return DailyLogResponse(
        log_date=d["log_date"],
        done=d.get("done", []),
        void_reason=d.get("void_reason"),
    )

@router.get("/range/{start}/{end}")
def get_range(start: str, end: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("daily_logs") \
        .select("*") \
        .eq("user_id", user_id) \
        .gte("log_date", start) \
        .lte("log_date", end) \
        .execute()

    # Build dict keyed by date for easy frontend consumption
    history = {}
    for d in result.data:
        history[d["log_date"]] = {
            "done": d.get("done", []),
            "void_reason": d.get("void_reason"),
        }
    return history

@router.post("/", response_model=DailyLogResponse)
def upsert_daily(body: DailyLogRequest, user_id: str = Depends(get_current_user)):
    sb = get_supabase()

    # Check if exists
    existing = sb.table("daily_logs") \
        .select("id") \
        .eq("user_id", user_id) \
        .eq("log_date", body.log_date) \
        .execute()

    payload = {
        "user_id": user_id,
        "log_date": body.log_date,
        "done": body.done,
        "void_reason": body.void_reason,
    }

    if existing.data:
        result = sb.table("daily_logs").update(payload).eq("id", existing.data[0]["id"]).execute()
    else:
        result = sb.table("daily_logs").insert(payload).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save daily log")

    d = result.data[0]
    return DailyLogResponse(
        log_date=d["log_date"],
        done=d.get("done", []),
        void_reason=d.get("void_reason"),
    )
