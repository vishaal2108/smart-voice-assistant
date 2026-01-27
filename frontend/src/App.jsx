import { useState } from "react";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoice = () => {
    if (!recognition) {
      alert("Speech Recognition not supported");
      return;
    }

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setText(transcript);
      processCommand(transcript);
    };
  };

  const processCommand = (command) => {
    let response = "";

    if (command.includes("hello")) {
      response = "Hello Vishaal, how can I help you?";
    } else if (command.includes("your name")) {
      response = "I am your smart college voice assistant";
    } else if (command.includes("time")) {
      response = `The current time is ${new Date().toLocaleTimeString()}`;
    } else {
      response = "Sorry, I did not understand that";
    }

    setReply(response);
    speak(response);
  };

  return (
    <div className="app">
      <h1>Smart Voice Assistant</h1>

      <button onClick={handleVoice}>🎤 Speak</button>

      <p><b>You said:</b> {text}</p>
      <p><b>Assistant:</b> {reply}</p>
    </div>
  );
}

export default App;
