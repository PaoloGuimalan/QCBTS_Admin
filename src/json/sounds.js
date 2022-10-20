import ChatSound from '../resources/audio/chat.mp3'

export const playSound = () => {
    let audio = new Audio(ChatSound);

    audio.play();
}