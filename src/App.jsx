import { useState, useEffect } from "react";
import "./App.css";
import { reqPesan } from "./utils/groq";
import { Analytics } from "@vercel/analytics/react";
import Cropper from "react-easy-crop";

function App() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [botName, setBotName] = useState("Ichigo - 015");
  const [showNameModal, setShowNameModal] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [botProfilePic, setBotProfilePic] = useState(
    "https://i.postimg.cc/1RVgqpRC/ichigo1.jpg"
  );
  const [newBotProfilePic, setNewBotProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptMode, setPromptMode] = useState("");
  const [showSaweriaPopup, setShowSaweriaPopup] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);

  // Fungsi untuk menghandle file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Fungsi untuk menghandle crop complete
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Fungsi untuk membuat crop final
  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setBotProfilePic(croppedImage);
      setShowCropModal(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Fungsi helper untuk mendapatkan gambar yang sudah di-crop
  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  useEffect(() => {
    setBotName(loadFromLocalStorage("botName", "Ichigo - 015"));
    setBotProfilePic(
      loadFromLocalStorage(
        "botProfilePic",
        "https://ezio.sakurani.my.id/f2a_9ESS4_164207.jpg"
      )
    );
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
    if (messages.length > 0) {
      setMessageCount(messages.length);
      if (messages.length === 10) {
        setShowSaweriaPopup(true);
      }
    }
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
    if (!promptMode) {
      alert("Silakan pilih mode chat terlebih dahulu (Pacar atau Bestie)");
      return;
    }

    const userContent = content.trim();
    const newUserMessage = { role: "user", content: userContent };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setMessageCount(updatedMessages.length);
    setLoading(true);
    setContent("");

    try {
      const aiReply = await reqPesan(userContent, updatedMessages, promptMode);
      const newAiMessage = { role: "ai", content: aiReply };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error fetching AI reply:", error);
      
      // User-friendly error handling
      let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      
      if (error.message.includes('terhubung ke server')) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (error.message.includes('Rate limit')) {
        errorMessage = "Terlalu banyak request. Tunggu sebentar dan coba lagi.";
      }
      
      const errorAiMessage = { 
        role: "ai", 
        content: errorMessage 
      };
      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = () => {
    if (newBotName.trim() === "") {
      alert("Nama bot tidak boleh kosong!");
      return;
    }
    if (newBotName.length < 3 || newBotName.length > 20) {
      alert("Nama bot harus terdiri dari 3 hingga 20 karakter!");
      return;
    }

    if (newBotProfilePic) {
      const fileType = newBotProfilePic.type;
      const fileSize = newBotProfilePic.size;
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];

      if (!validImageTypes.includes(fileType)) {
        alert(
          "Hanya file gambar berformat JPG, PNG, atau GIF yang diperbolehkan!"
        );
        return;
      }

      if (fileSize > 2 * 1024 * 1024) {
        // 2MB
        alert("Ukuran gambar tidak boleh lebih dari 2MB!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBotProfilePic(reader.result);
      };
      reader.readAsDataURL(newBotProfilePic);
      setNewBotProfilePic(null);
    }

    setBotName(newBotName);
    setNewBotName("");

    setShowNameModal(false);
  };

  const resetChat = () => {
    setMessages([]);
    saveToLocalStorage("messages", []);
    setMessageCount(0);
  };

  const handlePromptModeChange = (mode) => {
    setPromptMode(mode);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center bg-gray-100 px-4 sm:px-0">
      {promptMode === "" && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => handlePromptModeChange("pacar")}
            className="bg-blue-500 py-2 px-4 rounded-full hover:bg-blue-600 transition mr-4"
          >
            <span className="text-white text-lg font-bold">Mode Pacar🥰</span>
          </button>
          <button
            onClick={() => handlePromptModeChange("bestfriend")}
            className="bg-blue-500 py-2 px-4 rounded-full hover:bg-blue-600 transition"
          >
            <span className="text-white text-lg font-bold">Mode Bestie👊</span>
          </button>
        </div>
      )}
      <div className="w-full max-w-sm sm:max-w-xl bg-white shadow-lg rounded-lg flex flex-col">
        <header className="flex flex-col p-4 bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={botProfilePic}
                alt="Bot Avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3"
              />
              <h1 className="text-lg sm:text-xl font-bold">{botName}</h1>
            </div>
            <button
              onClick={() => setShowNameModal(true)}
              className="text-white text-2xl"
            >
              ⋮
            </button>
          </div>
          {loading && (
            <div className=" mt-1 ml-16 flex justify-start">
              <p className="text-sm font-medium text-white opacity-70">
                Mengetik...
              </p>
            </div>
          )}
        </header>

        {showNameModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowNameModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                Ubah Nama dan Foto Profil Bot
              </h2>
              <input
                type="text"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Masukkan nama bot baru"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameChange();
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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

        {/* Modal Crop Image */}
        {showCropModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md relative">
              <div className="relative h-[300px] w-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setImageToCrop(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  onClick={createCroppedImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {showSaweriaPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowSaweriaPopup(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                Enjoy this bot? pls support me on
              </h2>
              <a
                href="https://saweria.co/AditOne"
                target="_blank"
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-bold w-full hover:bg-blue-600 transition"
              >
                Saweria
              </a>
            </div>
          </div>
        )}

        <div 
          id="chat-messages"
          className="flex-grow overflow-y-auto max-h-[400px] mb-4 p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner scroll-smooth"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-center">
                {promptMode === "" 
                  ? "Pilih mode chat untuk memulai 👆" 
                  : "Kirim pesan untuk memulai percakapan 💬"}
              </p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl p-3 max-w-xs break-words shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p style={{ color: msg.role === "user" ? "white" : "black" }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center mt-4 px-4 w-full">
          <Analytics />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            disabled={loading || !promptMode}
            maxLength={5000}
            className="flex-grow py-2 px-4 text-md rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            aria-label="Message input"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim() || !promptMode}
            className="bg-blue-500 py-2 px-4 rounded-full sm:rounded-r-full hover:bg-blue-600 transition flex items-center justify-center w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Send message"
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
            <a
              href="https://github.com/AditSetiawan24"
              target="_blank"
              className="hover:text-gray-400"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="GitHub Logo"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://instagram.com/a_stwn1/"
              target="_blank"
              className="hover:text-gray-400"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                alt="Instagram Logo"
                className="w-8 h-8"
              />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const cropperStyles = {
  containerStyle: {
    position: "relative",
    width: "100%",
    height: 200,
    background: "#333",
  },
  cropAreaStyle: {
    color: "rgba(255, 255, 255, 0.38)",
  },
};

export default App;
