import './App.css'
import { Header } from './components/Header';
import { ChatBox } from './components/ChatBox';

function App() {
  return (
    <div className="App flex flex-col min-h-screen items-center">
      <Header />
      <ChatBox />
      <p className='w-3/4 mt-4 text-center text-gray-500'>
        Please note: This web app is hosted on a free instance that may spin down due to inactivity. As a result, your first request after a period of inactivity may experience a delay of 50 seconds or more as the instance spins up. We appreciate your patience.
      </p>
      <p className='text-sm mt-2 text-gray-500'>
        Made by <a href="https://jaimingodhani.me" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Jaimin Godhani</a>
      </p>
    </div>
  );
}

export default App
