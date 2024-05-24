// src/Chat.js

import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css'; // You can create a simple CSS file for styling

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [loading, setLoading] = useState(false); // New state to track loading status

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!userQuestion) return;

        // Add user's question to the chat immediately
        setMessages([...messages, { type: 'user', text: userQuestion }]);
        setLoading(true); // Set loading state to true

        setUserQuestion(''); // Clear the input field

        try {
            const response = await axios.post('http://localhost:8000/ask_question/', {
                user_question: userQuestion,
            });

            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: response.data.answer },
            ]);
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: 'Error fetching response. Please try again.' },
            ]);
        } finally {
            setLoading(false); // Set loading state to false after response is received
        }
    };

    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        await axios.post('http://localhost:8000/upload_pdf/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setUploadedFileName(acceptedFiles[0].name);
        alert('File uploaded and processed successfully');
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="chat-container">
            <div {...getRootProps()} className="file-upload">
                <input {...getInputProps()} />
                {uploadedFileName && <div className="uploaded-file">{uploadedFileName}</div>}
                <button type="button">Upload PDF</button>
            </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        {message.text}
                    </div>
                ))}
                {loading && <div className="message bot">Loading...</div>}
            </div>
            <form onSubmit={handleQuestionSubmit} className="chat-input">
                <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
