import { useState } from "react";
import VoiceInput from "./components/VoiceInput";
import "./App.css";

function App() {
  const [spokenText, setSpokenText] = useState("");

  return (
    <div className="app">
      <h1>$mart College Assistant</h1>
      <p>Your voice-enabled college helper</p>

      <div className="assistant-box">
        <VoiceInput onText={setSpokenText} />

        {/* Display the spoken text */}
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
          {spokenText ? `"${spokenText}"` : "Your speech will appear here..."}
        </p>
      </div>
    </div>
  );
}

export default App;
