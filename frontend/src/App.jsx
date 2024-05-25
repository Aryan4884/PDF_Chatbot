import './App.css'
import { Header } from './components/Header';
import { ChatBox } from './components/ChatBox';

function App() {
  return (
    <div className="App flex flex-col min-h-screen items-center">
    <Header />
    <ChatBox />

</div>
  );
}

export default App
