// simple API base for frontend — prefers VITE_API_BASE, falls back to localhost or production URL
const getApiBase = () => {
  try {
    const envBase = import.meta?.env?.VITE_API_BASE;
    if (envBase) return envBase.replace(/\/$/, "");
  } catch (e) {
    // import.meta may not be available in some environments; ignore
  }

  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "http://localhost:5000";
  return "https://pdc-quiz.onrender.com";
};

const API_BASE = getApiBase();


export default API_BASE;
