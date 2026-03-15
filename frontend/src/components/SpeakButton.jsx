import { useEffect, useMemo, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

const SPEECH_CHANGED_EVENT = "chatbot-speech-changed";

let activeSpeechId = null;

const isSpeechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

const languageMap = {
  en: "en-US",
  te: "te-IN",
  hi: "hi-IN",
  ta: "ta-IN",
};

const SpeakButton = ({ speechId, text, language = "en", className = "" }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported] = useState(() => isSpeechSupported());

  const langCode = useMemo(() => languageMap[language] || "en-US", [language]);

  useEffect(() => {
    if (!supported) return undefined;

    const stopHandler = (event) => {
      const nextId = event?.detail?.speechId ?? null;
      if (nextId !== speechId) {
        setIsSpeaking(false);
      }
    };

    window.addEventListener(SPEECH_CHANGED_EVENT, stopHandler);
    return () => window.removeEventListener(SPEECH_CHANGED_EVENT, stopHandler);
  }, [speechId, supported]);

  const speak = () => {
    if (!supported || !text) return;

    const synth = window.speechSynthesis;
    const cleanText = String(text).trim();
    if (!cleanText) return;

    if (activeSpeechId === speechId && isSpeaking) {
      synth.cancel();
      activeSpeechId = null;
      setIsSpeaking(false);
      window.dispatchEvent(new CustomEvent(SPEECH_CHANGED_EVENT, { detail: { speechId: null } }));
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      activeSpeechId = speechId;
      setIsSpeaking(true);
      window.dispatchEvent(new CustomEvent(SPEECH_CHANGED_EVENT, { detail: { speechId } }));
    };

    utterance.onend = () => {
      if (activeSpeechId === speechId) {
        activeSpeechId = null;
      }
      setIsSpeaking(false);
      window.dispatchEvent(new CustomEvent(SPEECH_CHANGED_EVENT, { detail: { speechId: null } }));
    };

    utterance.onerror = () => {
      if (activeSpeechId === speechId) {
        activeSpeechId = null;
      }
      setIsSpeaking(false);
      window.dispatchEvent(new CustomEvent(SPEECH_CHANGED_EVENT, { detail: { speechId: null } }));
    };

    synth.speak(utterance);
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={isSpeaking ? "Stop reading message" : "Read message aloud"}
      title={isSpeaking ? "Stop" : "Read aloud"}
      className={`interactive-btn inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold ${
        isSpeaking ? "bg-primary text-white" : "bg-white text-secondary"
      } ${className}`}
    >
      <FaVolumeUp className="text-xs" />
      <span>{isSpeaking ? "Stop" : "Speak"}</span>
    </button>
  );
};

export default SpeakButton;
