from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate AI Tutor API!"}

@app.get("/api/generate-question")
def generate_question(topic: str = Query(default="general real estate", description="Topic for the question")):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate tutor preparing students for their licensing exam."},
                {
                    "role": "user",
                    "content": f"""
                    Generate a real estate exam question about {topic} with four multiple-choice options.
                    Format the response clearly as follows:

                    Question: [Your question here]
                    A. Option 1
                    B. Option 2
                    C. Option 3
                    D. Option 4

                    Answer: [Correct answer letter]
                    """
                },
            ],
            max_tokens=200,
            temperature=0.7,
        )
        question = response["choices"][0]["message"]["content"].strip()
        return {"question": question}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/data")
def get_data():
    return {"data": "This is some static data from the backend!"}

@app.get("/api/questions")
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
                    Answer: [Correct answer letter and explanation]
                    """
                },
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        # Extract the response content
        content = response["choices"][0]["message"]["content"].strip()

        # Split the response into individual questions
        raw_questions = content.split("\n\n")

        # Process each question and separate answers
        formatted_questions = []
        for question in raw_questions:
            if "Answer:" in question:
                formatted_questions.append(question.strip())

        return {"questions": formatted_questions}
    except Exception as e:
        print("Error generating questions:", e)
        return {"error": str(e)}
