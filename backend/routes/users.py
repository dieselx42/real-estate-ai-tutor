from fastapi import APIRouter, Query

router = APIRouter()

# ✅ Sample user progress data storage
user_progress_data = {
    "test": {"correct_answers": 5, "total_questions": 10, "accuracy": "50%"},
    "user123": {"correct_answers": 8, "total_questions": 10, "accuracy": "80%"},
}

@router.get("/")
def get_user_progress(userId: str = Query(..., description="User ID for fetching progress")):
    if userId in user_progress_data:
        return {"userId": userId, "progress": user_progress_data[userId]}
    else:
        return {"userId": userId, "progress": "No progress data found"}
