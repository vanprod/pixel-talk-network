
// Sound effect utility functions
export const playSendMessageSound = () => {
  const audio = new Audio('/sounds/send-message.mp3');
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.error('Error playing send message sound:', error);
  });
};

export const playAudioOpenSound = () => {
  const audio = new Audio('/sounds/audio-open.mp3');
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.error('Error playing audio open sound:', error);
  });
};
