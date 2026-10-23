import { Player_Fl1nk } from "./player_fl1nk.js";

const canvas = document.getElementById("fl1nk-game-canvas");
if (!canvas) {
    throw new Error('Canvas "fl1nk-game-canvas" was not found.');
}

const context = canvas.getContext("2d");
const keysPressed = Object.create(null);
let player;

window.addEventListener("keydown", event => {
    if (event.key.startsWith("Arrow")) event.preventDefault();
    keysPressed[event.key] = true;
});

window.addEventListener("keyup", event => {
    keysPressed[event.key] = false;
});

window.addEventListener("blur", () => {
    for (const key of Object.keys(keysPressed)) {
        keysPressed[key] = false;
    }
});

async function startLevel2() {
    try {
        const response = await fetch("assets/data/fl1nk-maze-layout-level2.json");
        if (!response.ok) {
            throw new Error(`Could not load Level 2 maze data (${response.status}).`);
        }

        const mazeData = await response.json();
        player = new Player_Fl1nk(context, mazeData);
        window.setInterval(drawFrame, 20);
    } catch (error) {
        console.error("Level 2 could not start:", error);
    }
}

function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.move(keysPressed);

    // The sprite may still be loading on the first game frames.
    if (player.image.complete && player.image.naturalWidth > 0) {
        player.draw();
    }
}

startLevel2();

