from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize the OpenAI client
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Debug: Print the API key to confirm it's loaded
print("API Key:", os.getenv("OPENAI_API_KEY"))

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate AI Tutor!"}

@app.get("/api/data")
def get_data():
    return {"data": "This is some data from the backend!"}

def get_questions():
    return {
        "questions": [
            "What is adverse possession?",
            "Explain the difference between freehold and leasehold.",
            "What are the key elements of a valid contract?",
        ]
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate AI Tutor!"}

@app.get("/api/data")
def get_data():
    return {"data": "This is some data from the backend!"}

@app.get("/api/questions")
def get_questions():
    return {
        "questions": [
            "What is adverse possession?",
            "Explain the difference between freehold and leasehold.",
            "What are the key elements of a valid contract?",
        ]
    }

@app.get("/api/generate-question")
def generate_question():
    try:
        print("Using API Key:", os.getenv("OPENAI_API_KEY"))  # Debug: Print the API key
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt="""
            Generate a real estate exam question with four multiple-choice options. Format the question and options clearly. For example:

            Question: What is adverse possession?
            A. A type of lease agreement
            B. A legal doctrine that allows someone to claim ownership of land under certain conditions
            C. A method of property valuation
            D. A type of mortgage

            Answer: B

            Now generate a new question:
            """,
            max_tokens=150,  # Increase tokens to allow for longer responses
            stop=["\n\n"],  # Stop generating after a double newline
        )
        # Clean up the response
        question = response.choices[0].text.strip()
        question = " ".join(question.split())  # Remove extra spaces
        return {"question": question}
    except Exception as e:
        print("Error:", e)  # Debug: Print the full error
        return {"error": str(e)}