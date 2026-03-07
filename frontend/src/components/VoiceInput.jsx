import React, { useState, useEffect, useRef } from "react";
import styles from "./VoiceInput.module.css";

const VoiceInput = () => {
  const [youSaid, setYouSaid] = useState(""); // what user speaks
  const [assistantReply, setAssistantReply] = useState(""); // reply text
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setYouSaid(transcript);
      setShowResult(true);
      sendCommand(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel(); // stop any ongoing speech
    setIsListening(false);
    setYouSaid(""); // clear "You said"
    setAssistantReply(""); // clear reply container
    setShowResult(false);
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
      setAssistantReply("Something went wrong while fetching voice response.");
      console.error(err);
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.wrapper}>
      {showResult && (
        <div className={styles.responseCard}>
          <p className={styles.label}>You asked</p>
          <p className={styles.queryText}>{youSaid}</p>

          <p className={styles.label}>Assistant reply</p>
          <pre className={styles.replyText}>{assistantReply}</pre>
        </div>
      )}

      <div className={styles.buttonRow}>
        <button
          onClick={startListening}
          className={styles.startButton}
        >
          {isListening ? "Listening..." : "Start"}
        </button>

        <button
          onClick={stopListening}
          className={styles.stopButton}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default VoiceInput;
