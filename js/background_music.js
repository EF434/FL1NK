const music = new Audio("assets/sounds/background_music.mp3");
music.loop = true;

document.addEventListener("click", () => music.play(), { once: true });