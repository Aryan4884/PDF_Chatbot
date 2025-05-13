# 📄 PDF Chatbot

**PDF Chatbot** is a full-stack AI-powered application that lets users upload PDF documents and interact with them through natural language questions. Using advanced NLP models, it provides accurate, contextual answers drawn directly from the document content.

---

## 🚀 Features

- Upload and parse PDF documents
- Ask natural language questions about PDF content
- Get intelligent, real-time answers
- Clean, responsive UI using React & Tailwind CSS
- Fast backend powered by FastAPI and LangChain

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Jai0401/QueryPDF.git
cd QueryPDF
```
2. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```
Create a .env file in the backend directory with required variables (e.g., API keys if needed).

Start the development server:
```bash
uvicorn app:app --reload
```
3. Frontend Setup (React.js)
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:3000 in your browser.


🧱 Application Architecture
🖥 Backend (FastAPI + LangChain)
Parses and indexes uploaded PDFs

Handles semantic search and question-answering

REST API interface

🌐 Frontend (React + Tailwind CSS)
File uploader and chatbot UI

Axios-powered API communication

Handles chat history, loading states, and error feedback

🔗 Try the App
🎥 Watch Demo Video

🤝 Contributing
Want to make PDF Chatbot even better?
You're welcome to open issues, suggest features, or submit pull requests.
