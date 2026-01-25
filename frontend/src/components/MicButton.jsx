const MicButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
      🎤 Speak
    </button>
  );
};

export default MicButton;
