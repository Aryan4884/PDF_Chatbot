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
