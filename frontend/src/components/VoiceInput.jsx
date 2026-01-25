const VoiceInput = ({ onText }) => {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      console.log(event.results[0][0].transcript); // check console
      onText(event.results[0][0].transcript);
    };

    recognition.onerror = (err) => {
      console.error(err);
      alert("Error occurred: " + err.error);
    };
  };

  return <button onClick={startListening}>🎤 Speak</button>;
};

export default VoiceInput;
