// src/Chat.js

import './App.css'; // You can create a simple CSS file for styling
import { ChatBox } from './components/ChatBox';
import { Header } from './components/Header';

const Chat = () => {
    return (
        <div className="chat-container flex flex-col min-h-screen items-center">
            <Header />
            <ChatBox />

        </div>
    );
};

export default Chat;
