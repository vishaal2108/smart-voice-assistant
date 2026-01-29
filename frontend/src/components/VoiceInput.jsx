import React, { useState, useEffect, useRef } from "react";

const VoiceInput = () => {
  const [youSaid, setYouSaid] = useState(""); // what user speaks
  const [assistantReply, setAssistantReply] = useState(""); // reply text
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setYouSaid(transcript);
      sendCommand(transcript);
    };
  }, []);

  const startListening = () => {
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current.stop();
    window.speechSynthesis.cancel(); // stop any ongoing speech
    setYouSaid(""); // clear "You said"
    setAssistantReply(""); // clear reply container
  };

  const sendCommand = async (command) => {
    try {
      const res = await fetch("http://localhost:5000/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      setAssistantReply(data.reply); // show in UI
      speakResponse(data.reply);
    } catch (err) {
      console.error(err);
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ width: "400px", margin: "50px auto", textAlign: "center" }}>
      {/* User said */}
      <textarea
        value={youSaid}
        placeholder="You said..."
        readOnly
        rows={3}
        style={{
          width: "100%",
          marginBottom: "10px",
          fontSize: "16px",
          backgroundColor: "#f0f0f0",
          color: "#333",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* Assistant reply (timetable output) */}
      <textarea
        value={assistantReply}
        placeholder="Assistant reply..."
        readOnly
        rows={8}
        style={{
          width: "100%",
          marginBottom: "10px",
          fontSize: "16px",
          backgroundColor: "#f0f0f0", // same as input
          color: "#333",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          whiteSpace: "pre-wrap", // preserve new lines
        }}
      />

      {/* Buttons */}
      <div>
        <button
          onClick={startListening}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
           Start
        </button>

        <button
          onClick={stopListening}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginLeft: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
           Stop
        </button>
      </div>
    </div>
  );
};

export default VoiceInput;
