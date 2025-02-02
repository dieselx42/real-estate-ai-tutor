from fastapi import APIRouter

router = APIRouter()

@router.get("/ai-recommendations")
async def get_ai_recommendations():
    return {
        "recommendations": [
            "Review property valuation principles.",
            "Practice more questions on real estate contracts.",
            "Deep dive into mortgage laws for better understanding."
        ]
    }
}
