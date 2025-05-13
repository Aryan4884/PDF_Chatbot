import './App.css'
import { Header } from './components/Header';
import { ChatBox } from './components/ChatBox';
import KeepAlive from './components/KeepAlive';

function App() {
  return (
    <div className="App flex flex-col min-h-screen items-center bg-green-100">
      <KeepAlive />
      <Header />
      <ChatBox />
      <p className='text-sm mt-2 text-gray-500 mb-10'>
        Made by <a href="https://heroic-begonia-be98f4.netlify.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Aryan Raj</a>
      </p>
    </div>
  );
}

export default App
