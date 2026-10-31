// import the coin positions
import { coins_for_every_level } from "./coin_positions.js";

// define the coin elements
const COIN_SIZE = 40;
const COIN_SCORE = 5;


// This class maanges all the coins logic
export class Fl1nk_Coins {
    // setting up the required varibales for the game logic
    constructor(context, levelNumber, scoreElement, decks) {
        this.context = context;
        this.coins = [];
        this.scoreElement = scoreElement;
        this.score = 0;
        this.coin_sound = new Audio("../assets/sounds/coin.mp3");
        this.image = new Image();
        this.image.src = "../assets/images/coin.png";

    // get coin positions in the defined file
    let coinPositions = coins_for_every_level[levelNumber];

    // Go over each deck to assign coins
    let i = 0
    for (; i < coinPositions.length; i++) {

        let place_coins = coinPositions[i];
        let deck = decks[place_coins.deck];


        // create the coins for each deck
        let coinX = place_coins.firstX;
        let coinY = deck.y - COIN_SIZE - 20;

        for (let coin_index = 0; coin_index < place_coins.count; coin_index++) {

        // Store the coin position
        this.coins.push({ x: coinX, y: coinY });

        // Move to the next coin position
        coinX = coinX + 90;
        }
    }
    }

   draw() {

    // Draw all coins
    for (let i = 0; i < this.coins.length; i++) {
    this.context.drawImage(this.image, this.coins[i].x, this.coins[i].y,40,40);
    }
}

    // collect the coins for the players
    collect(player) {

        for (let i = this.coins.length - 1; i >= 0; i--) {

            let coin = this.coins[i];

            // Check FL1NK's horizontal position
            if (player.horizontal_position < coin.x - 80) continue;
            if (player.horizontal_position > coin.x + 40) continue;

            // Check FL1NK's vertical position
            if (player.vertical_position < coin.y - 95) continue;
            if (player.vertical_position > coin.y + 40) continue;

            // Collect the coin
            this.coins.splice(i, 1);

            // Add points
            this.score = this.score + COIN_SCORE;
            this.scoreElement.textContent = this.score;

            // Play sound
            this.coin_sound.currentTime = 0;
            this.coin_sound.play();
        }
    }
}