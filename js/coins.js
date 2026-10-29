import { coins_for_every_level } from "./coin_positions.js";

const COIN_SIZE = 40;
const POINTS_PER_COIN = 5;
const COIN_SPACING = 90;

export class CoinManager {
    constructor(context, levelNumber, scoreElement, decks) {
        this.context = context;
        this.coins = [];
        this.scoreElement = scoreElement;
        this.score = 0;

        this.coinSound = new Audio("../assets/sounds/coin.mp3");

        for (const placement of coins_for_every_level[levelNumber]) {
            const deck = decks[placement.deck];

            for (let index = 0; index < placement.count; index++) {
                this.coins.push({
                    x: placement.firstX + index * COIN_SPACING,
                    y: deck.y - COIN_SIZE - 20
                });
            }
        }

        this.image = new Image();
        this.image.src = "../assets/images/coin.png";
    }

    draw() {
        if (!this.image.complete || this.image.naturalWidth === 0) return;

        for (const coin of this.coins) {
            this.context.drawImage(
                this.image,
                coin.x,
                coin.y,
                COIN_SIZE,
                COIN_SIZE
            );
        }
    }

    collect(player) {
        for (let index = this.coins.length - 1; index >= 0; index--) {
            const coin = this.coins[index];
            const touchingCoin =
                player.xPos < coin.x + COIN_SIZE &&
                player.xPos + player.width > coin.x &&
                player.yPos < coin.y + COIN_SIZE &&
                player.yPos + player.height > coin.y;

            if (touchingCoin) {
                this.coins.splice(index, 1);
                this.score += POINTS_PER_COIN;
                this.scoreElement.textContent = this.score;

                this.coinSound.currentTime = 0;
                this.coinSound.play().catch(() => {
                    // The game continues if the browser blocks audio.
                });
            }
        }
    }
}