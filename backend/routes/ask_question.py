from fastapi import APIRouter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from utils import get_conversational_chain
from utils import question_answer_history
import os

router = APIRouter()

# Define your request model
class QuestionInput(BaseModel):
    user_question: str

@router.post("/ask_question/")
async def ask_question(question_input: QuestionInput):
    user_question = question_input.user_question
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    try:
        new_db = FAISS.load_local(os.path.join(os.getcwd(), "faiss_index"), embeddings,
                                  allow_dangerous_deserialization=True)
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        return

    # Retrieve document objects from the FAISS index
    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()

    # Join all text chunks to create the full context
    full_text = " ".join([str(doc) for doc in docs])

    # Pass the input_documents key to the chain along with the context and question
    response = chain({"input_documents": docs, "context": full_text, "question": user_question}, return_only_outputs=True)

    # Append the new question-answer pair to the history
    question_answer_history.append({"question": user_question, "answer": response["output_text"]})

    return {"question": user_question, "answer": response["output_text"]}
