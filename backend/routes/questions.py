from fastapi import APIRouter
import openai

router = APIRouter()

@router.get("/questions")
def get_questions(topic: str = "general real estate"):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful real estate tutor."},
                {
                    "role": "user",
                    "content": f"""
                    Generate three real estate exam questions about {topic}, each with four multiple-choice options.
                    Format each question clearly as follows:

                    Question: [Your question here]
                    A. Option 1
                    B. Option 2
                    C. Option 3
                    D. Option 4
                    Answer: [Correct answer letter only]
                    """
                },
            ],
            max_tokens=1000,
            temperature=0.7,
        )

        # Extract the response content
        content = response["choices"][0]["message"]["content"].strip()
        print("🔍 Backend API Generated Questions:\n", content)  # Debugging output

        return {"questions": content.split("\n\n")}

    except Exception as e:
        print("❌ Error generating questions:", e)
        return {"error": str(e)}
