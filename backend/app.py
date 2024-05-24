from fastapi import FastAPI, File, UploadFile, HTTPException
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel
import shutil
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


app = FastAPI()

# Define your updated CORS settings
origins = [
    "http://localhost:5173", 
    "https://query-pdf-swart.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

question_answer_history = []


def get_pdf_text(pdf_path):
    text = ""
    try:
        pdf_reader = PdfReader(pdf_path)
        for page in pdf_reader.pages:
            text += page.extract_text()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {e}")
    return text


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks


def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")


def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # Define the target directory
    upload_directory = "uploaded_files"

    # Create the directory if it doesn't exist
    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)
    else:
        # Delete any existing files in the directory
        for filename in os.listdir(upload_directory):
            file_path = os.path.join(upload_directory, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

    # Save the uploaded PDF file
    file_location = os.path.join(upload_directory, file.filename)
    try:
        with open(file_location, "wb") as f:
            f.write(await file.read())  # Ensure async file read
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving PDF: {e}")

    # Process the PDF to create embeddings
    try:
        raw_text = get_pdf_text(file_location)  # Extract text from the PDF
        text_chunks = get_text_chunks(raw_text)  # Split the text into chunks
        get_vector_store(text_chunks)  # Create and save vector store embeddings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

    return {"info": f"File '{file.filename}' uploaded and processed successfully"}



class QuestionInput(BaseModel):
    user_question: str
    
@app.post("/ask_question/")
async def ask_question(question_input: QuestionInput):
    user_question = question_input.user_question
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    try:
        new_db = FAISS.load_local(os.path.join(os.getcwd(), "faiss_index"), embeddings,
                                  allow_dangerous_deserialization=True)
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        return

    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()

    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

    # Append the new question-answer pair to the history
    question_answer_history.append({"question": user_question, "answer": response["output_text"]})

    return {"question": user_question, "answer": response["output_text"]}


@app.get("/history/")
async def get_history():
    return question_answer_history
