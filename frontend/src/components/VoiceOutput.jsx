import { useEffect } from "react";

const VoiceOutput = ({ text }) => {
  useEffect(() => {
    if (!text) return; // do nothing if empty

    // Check if browser supports speechSynthesis
    if ("speechSynthesis" in window) {
      // Stop any previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";   // Indian English
      utterance.rate = 1;         // normal speed
      utterance.pitch = 1;        // normal pitch

      // Optional: log when speaking
      utterance.onstart = () => console.log("🔊 Speaking: ", text);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis NOT supported in your browser.");
    }
  }, [text]);

  return null; // no UI element
};

export default VoiceOutput;
