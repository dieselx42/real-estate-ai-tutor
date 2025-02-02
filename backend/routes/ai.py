from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_ai_recommendations():
    return {"recommendations": ["Study topic X", "Review practice exam Y", "Focus on concept Z"]}

