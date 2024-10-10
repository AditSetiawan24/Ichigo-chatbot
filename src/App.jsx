import { useState, useEffect } from 'react';
import './App.css';
import { reqPesan } from "./utils/groq";

function App() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [botName, setBotName] = useState("Ichigo - 015");
  const [showNameModal, setShowNameModal] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [botProfilePic, setBotProfilePic] = useState("https://ezio.sakurani.my.id/f2a_9ESS4_164207.jpg");
  const [newBotProfilePic, setNewBotProfilePic] = useState(null);

  useEffect(() => {
    setBotName(loadFromLocalStorage("botName", "Ichigo - 015"));
    setBotProfilePic(loadFromLocalStorage("botProfilePic", "https://ezio.sakurani.my.id/f2a_9ESS4_164207.jpg"));
    setMessages(loadFromLocalStorage("messages", []));
  }, []); 

  useEffect(() => {
    saveToLocalStorage("botName", botName);
  }, [botName]);

  useEffect(() => {
    saveToLocalStorage("botProfilePic", botProfilePic);
  }, [botProfilePic]);

  useEffect(() => {
    saveToLocalStorage("messages", messages);
  }, [messages]);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const loadFromLocalStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const handleSubmit = async () => {
    if (content.trim() === "") return;

    const newUserMessage = { role: "user", content };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
      const aiReply = await reqPesan(content, updatedMessages);
      const newAiMessage = { role: "ai", content: aiReply };

      setMessages(prev => [...prev, newAiMessage]);
      setContent("");
    } catch (error) {
      console.error('Error fetching AI reply:', error);
    }
  };

  const handleNameChange = () => {
    if (newBotName.trim() !== "") {
      setBotName(newBotName);
      setNewBotName("");
    }

    if (newBotProfilePic) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotProfilePic(reader.result);
      };
      reader.readAsDataURL(newBotProfilePic);
      setNewBotProfilePic(null);
    }

    setShowNameModal(false);
  };

  const resetChat = () => {
    setMessages([]);
    saveToLocalStorage("messages", []);
  };

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center bg-gray-100 px-4 sm:px-0">
      <div className="w-full max-w-sm sm:max-w-xl bg-white shadow-lg rounded-lg flex flex-col">
        <header className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center">
            <img
              src={botProfilePic}
              alt="Bot Avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3"
            />
            <h1 className="text-lg sm:text-xl font-bold">{botName}</h1>
          </div>
          <button onClick={() => setShowNameModal(true)} className="text-white text-2xl">⋮</button>
        </header>

        {showNameModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Ubah Nama dan Foto Profil Bot</h2>
              <input
                type="text"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Masukkan nama bot baru"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameChange();
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewBotProfilePic(e.target.files[0])}
                className="mb-4 w-full text-gray-700"
              />
              <button
                onClick={handleNameChange}
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-bold w-full hover:bg-blue-600 transition"
              >
                Konfirmasi
              </button>

              <button
                onClick={resetChat}
                className="bg-red-500 py-2 px-4 font-bold text-white rounded-md hover:bg-red-600 transition mt-4 w-full"
              >
                Reset Chat
              </button>
            </div>
          </div>
        )}

        <div className="flex-grow overflow-y-auto max-h-[400px] mb-4 p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-2xl p-3 max-w-xs break-words shadow-md ${
                  msg.role === "user" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center mt-4 px-4 w-full">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-grow py-2 px-4 text-md rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full sm:w-auto"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 py-2 px-4 rounded-full sm:rounded-r-full hover:bg-blue-600 transition flex items-center justify-center w-full sm:w-auto"
          >
            {/* Paper Airplane Icon */}
            <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-white"
    fill="none"
    viewBox="2 2 20 20"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z" />
  </svg>
          </button>
        </div>
      </div>

      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-2 hidden sm:block">
        <div className="container mx-auto text-center">
          <p className="text-lg">Creator :</p>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="https://github.com/AditSetiawan24" target="_blank" className="hover:text-gray-400">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub Logo" className="w-8 h-8" />
            </a>
            <a href="https://instagram.com/aditsetiawan_24/" target="_blank" className="hover:text-gray-400">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram Logo" className="w-8 h-8" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
