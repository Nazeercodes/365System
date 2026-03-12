from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import JournalEntryRequest, JournalEntryResponse
from app.config import get_supabase, get_current_user
from datetime import datetime, date
import uuid

router = APIRouter()

def is_locked(log_date: str, reset_hour: int) -> bool:
    """Journal locks after reset_hour on the next day"""
    entry_date = date.fromisoformat(log_date)
    today = date.today()
    now_hour = datetime.now().hour

    if entry_date < today:
        return True
    if entry_date == today and now_hour >= reset_hour and reset_hour != 0:
        return False  # Still today's journal
    return False

@router.get("/pillar/{pillar_id}")
def get_pillar_archive(pillar_id: str, user_id: str = Depends(get_current_user)):
    """Get all journal entries for a pillar — the archive"""
    sb = get_supabase()
    result = sb.table("journal_entries") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("pillar_id", pillar_id) \
        .order("log_date", desc=True) \
        .execute()

    return {"pillar_id": pillar_id, "entries": result.data or []}

@router.get("/{log_date}")
def get_day_journals(log_date: str, user_id: str = Depends(get_current_user)):
    """Get all journal entries for a specific day"""
    sb = get_supabase()
    result = sb.table("journal_entries") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("log_date", log_date) \
        .execute()

    # Return as dict keyed by pillar_id
    journals = {}
    for entry in (result.data or []):
        journals[entry["pillar_id"]] = {
            "id": entry["id"],
            "content": entry["content"],
            "locked": entry.get("locked", False),
            "created_at": entry["created_at"],
        }
    return journals

@router.post("/", response_model=JournalEntryResponse)
def upsert_journal(body: JournalEntryRequest, user_id: str = Depends(get_current_user)):
    sb = get_supabase()

    # Check if already locked
    existing = sb.table("journal_entries") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("log_date", body.log_date) \
        .eq("pillar_id", body.pillar_id) \
        .execute()

    if existing.data and existing.data[0].get("locked"):
        raise HTTPException(status_code=403, detail="Journal entry is locked and cannot be edited")

    now = datetime.utcnow().isoformat()

    if existing.data:
        result = sb.table("journal_entries").update({
            "content": body.content,
            "updated_at": now,
        }).eq("id", existing.data[0]["id"]).execute()
    else:
        result = sb.table("journal_entries").insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "log_date": body.log_date,
            "pillar_id": body.pillar_id,
            "content": body.content,
            "locked": False,
            "created_at": now,
            "updated_at": now,
        }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save journal entry")

    e = result.data[0]
    return JournalEntryResponse(
        id=e["id"],
        log_date=e["log_date"],
        pillar_id=e["pillar_id"],
        content=e["content"],
        locked=e.get("locked", False),
        created_at=e["created_at"],
    )

@router.post("/lock/{log_date}")
def lock_day_journals(log_date: str, user_id: str = Depends(get_current_user)):
    """Lock all journal entries for a past day — called at day reset"""
    sb = get_supabase()
    result = sb.table("journal_entries") \
        .update({"locked": True}) \
        .eq("user_id", user_id) \
        .eq("log_date", log_date) \
        .execute()
    return {"locked": True, "log_date": log_date}
