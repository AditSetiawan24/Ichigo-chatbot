// Secure API call through backend proxy
// API key is now safely stored on the server side
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const reqPesan = async (content, history, promptMode) => {
  // Validate prompt mode before sending
  if (!promptMode || !['pacar', 'bestfriend'].includes(promptMode)) {
    alert("Pilih mode chat terlebih dahulu ya");
    throw new Error("Invalid prompt mode");
  }

  // Validate content
  if (!content || typeof content !== 'string' || content.trim() === '') {
    throw new Error("Content tidak valid");
  }

  // Validate history
  if (!Array.isArray(history)) {
    throw new Error("History harus berupa array");
  }

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify({
        content,
        history,
        promptMode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error("Response tidak valid dari server");
    }

    return data.response;
  } catch (error) {
    console.error("Error fetching AI reply:", error);
    
    // User-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error("Tidak dapat terhubung ke server. Pastikan server backend berjalan.");
    }
    
    throw error;
  }
};
