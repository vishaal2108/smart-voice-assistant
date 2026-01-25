import { useState } from "react";
import VoiceInput from "./components/VoiceInput";
import VoiceOutput from "./components/VoiceOutput";
import "./App.css";

function App() {
  const [spokenText, setSpokenText] = useState("");

  return (
    <div className="app">
      <h1>Smart Voice Assistant</h1>
      <p>Your voice-enabled college helper</p>

      <div className="assistant-box">
        <VoiceInput onText={setSpokenText} />

        <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
          {spokenText ? `"${spokenText}"` : "Your speech will appear here..."}
        </p>

        {/* Voice output */}
        <VoiceOutput text={spokenText} />
      </div>
    </div>
  );
}

export default App;
