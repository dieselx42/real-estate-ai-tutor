from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
from typing import List

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate AI Tutor API!"}


def generate_openai_prompt(topic: str, num_questions: int = 1) -> str:
    """Helper function to generate OpenAI prompt."""
    if num_questions == 1:
        return f"""
        Generate a real estate exam question about {topic} with four multiple-choice options.
        Format the response clearly as follows:

        Question: [Your question here]
        A. Option 1
        B. Option 2
        C. Option 3
        D. Option 4

        Answer: [Correct answer letter]
        """
    else:
        return f"""
        Generate {num_questions} real estate exam questions about {topic}, each with four multiple-choice options.
        Format the response clearly as follows:

        Question 1: [Your question here]
        A. Option 1
        B. Option 2
        C. Option 3
        D. Option 4

        Question 2: [Your question here]
        A. Option 1
        B. Option 2
        C. Option 3
        D. Option 4

        Question 3: [Your question here]
        A. Option 1
        B. Option 2
        C. Option 3
        D. Option 4
        """


@app.get("/api/generate-question")
def generate_question(topic: str = Query(default="general real estate", description="Topic for the question")):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a real estate tutor preparing students for their licensing exam."},
                {"role": "user", "content": generate_openai_prompt(topic, num_questions=1)},
            ],
            max_tokens=200,
            temperature=0.7,
        )
        question = response["choices"][0]["message"]["content"].strip()
        return {"question": question}
    except Exception as e:
        print("Error generating question:", e)
        return {"error": "Failed to generate the question. Please try again later."}


@app.get("/api/questions")
def get_questions(topic: str = Query(default="general real estate", description="Topic for the questions")):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful real estate tutor."},
                {"role": "user", "content": generate_openai_prompt(topic, num_questions=3)},
            ],
            max_tokens=500,
            temperature=0.7,
        )
        # Extract questions from the response
        content = response["choices"][0]["message"]["content"].strip()
        questions = content.split("\n\n")  # Split the response into individual questions
        return {"questions": questions}
    except Exception as e:
        print("Error generating questions:", e)
        return {"error": "Failed to generate questions. Please try again later."}


@app.get("/api/data")
def get_data():
    return {"data": "This is some static data from the backend!"}
