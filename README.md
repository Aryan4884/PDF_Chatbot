# QueryPDF

Welcome to the QueryPDF! This project aims to create a full-stack application that allows users to upload PDF documents, ask questions about their content, and receive answers generated through natural language processing. Below are the setup instructions, API documentation, and an overview of the application architecture.

## Setup Instructions

1. **Backend Setup**
   - Clone the repository: `git clone <repository_url>`
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `pip install -r requirements.txt`
   - Start the FastAPI server: `uvicorn app:app --reload`

2. **Frontend Setup**
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Start the React development server: `npm run dev`

## API Documentation

- **PDF Upload Endpoint**
  - POST `/upload_pdf`
  - Request Body: Form Data
    - `file`: PDF file
  - Response: `{
    "info": "File <file-name> uploaded and processed successfully"
}`

- **Question-Answer Endpoint**
  - POST `/ask-question`
  - Request Body: `{ "user_question": <question_text> }`
  - Response: `{
    "question": "<question_text>",
    "answer": "<answer_text>"
}`

## Application Architecture

- **Backend (FastAPI)**
  - Handles PDF uploads, question processing, and answer generation.
  - Utilizes LangChain for natural language processing.
  - [Backend Architecture and Workflow Overview](backend/README.md#Backend-Architecture-and-Workflow-Overview)

- **Frontend (React.js)**
  - Provides interfaces for PDF upload and asking questions.
  - Displays answers and allows for follow-up or new questions on uploaded documents.
  - Implements feedback mechanisms and error handling for user interactions.

## Demo

A live demo of the application can be accessed [https://query-pdf-swart.vercel.app/](<demo_link>).
