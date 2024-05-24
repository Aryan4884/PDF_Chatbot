import { useState } from 'react';
import axios from 'axios';

export function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
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
    return (
        <main className="flex flex-col flex-1 p-4 space-y-4 w-3/4 mt-4">
            <div className="flex-1 overflow-y-auto mt-20">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'} w-3/4`}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex justify-start"><div className="p-2 bg-gray-300 rounded-lg">Loading...</div></div>}
            </div>
            <form onSubmit={handleQuestionSubmit} className="flex items-center mb-4 bg-white rounded-lg shadow-md fixed bottom-4 left-1/2 transform -translate-x-1/2 w-3/4">
                <input
                    className="flex-1 p-2 mr-2 border border-gray-300 rounded-md shadow-sm"
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button type="submit" className="p-2 text-blue-500 bg-transparent border-none">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.1667 11L2.75 18.3333L6.01608 11L2.75 3.66666L20.1667 11ZM20.1667 11H5.95833" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </form>
        </main>
      );
}