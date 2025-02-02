from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_upcoming_sessions():
    return {"sessions": ["Session 1", "Session 2", "Session 3"]}

