import React from "react";

const MicButton = ({ onClick, onStop }) => {
  return (
    <div>
      <button onClick={onClick}>🎤 Start</button>
      <button onClick={onStop} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
        🛑 Stop
      </button>
    </div>
  );
};

export default MicButton;
