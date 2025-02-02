from fastapi import APIRouter, Query
import openai
import json
import re

router = APIRouter()

@router.get("/", tags=["Questions"])  # ✅ Fix: Endpoint should be /api/questions
def get_questions(topic: str = Query(default="general real estate", description="Topic for the question")):
    """Fetches real estate exam questions using OpenAI."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful real estate tutor."},
                {
                    "role": "user",
                    "content": f"""
                    Generate three real estate exam questions about {topic}, each with four multiple-choice options.
                    Format each question clearly as JSON:
                    {{
                        "questions": [
                            {{
                                "question": "What is a general warranty deed?",
                                "options": ["A. Provides full protection", "B. Only protects for grantor's ownership period", "C. No guarantees", "D. Used in commercial transactions"],
                                "answer": "A"
                            }},
                            ...
                        ]
                    }}
                    """
                },
            ],
            max_tokens=1000,
            temperature=0.7,
        )

        raw_response = response["choices"][0]["message"]["content"].strip()

        # ✅ Step 1: Try direct JSON parsing
        try:
            question_data = json.loads(raw_response)
        except json.JSONDecodeError:
            # 🔄 Step 2: Fallback to regex extraction
            match = re.search(r'\{.*\}', raw_response, re.DOTALL)
            if match:
                question_data = json.loads(match.group(0))
            else:
                raise ValueError("❌ OpenAI did not return valid JSON.")

        return question_data  # ✅ Return structured JSON

    except Exception as e:
        print(f"❌ Error generating questions: {e}")
        return {"error": str(e)}
