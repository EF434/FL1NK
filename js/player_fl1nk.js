import { fl1nkAnimationData } from "./fl1nk_spirate_animation.js";

/** Shared FL1NK movement and animation for every level. */
export class Player_Fl1nk {
    context;
    image;
    decks;
    ladders;
    animationData = fl1nkAnimationData;

    width = 90;
    height = 95;
    scale = 90 / 256;
    speed = 4;
    climbSpeed = 3;
    distanceToLadder = 30;

    xPos;
    yPos;
    currentDeck;
    direction = "front";
    currentFrame = 0;
    animationCounter = 0;
    climbing = false;
    targetDeck = null;
    previousUp = false;
    previousDown = false;

    constructor(context, mazeData, spawn = {}) {
        this.context = context;
        this.decks = mazeData.decks;
        this.ladders = mazeData.ladders;

        // A level may define spawn data; otherwise use the current Level 1 defaults.
        this.currentDeck = spawn.deck ?? mazeData.spawn?.deck ?? 1;
        this.xPos = spawn.x ?? mazeData.spawn?.x ?? 910;
        this.image = new Image();
        this.image.src = "assets/images/fl1nk-spirate-sheet.png";

        this.snapToDeck();
    }

    snapToDeck() {
        const deck = this.decks[this.currentDeck];
        if (!deck) throw new Error(`Starting deck ${this.currentDeck} is missing from the level data.`);
        this.yPos = deck.y - this.height;
        this.keepOnDeck(deck);
    }

    move(keys) {
        const upPressed = !!keys["ArrowUp"];
        const downPressed = !!keys["ArrowDown"];

        if (this.climbing) {
            this.climb();
            this.previousUp = upPressed;
            this.previousDown = downPressed;
            return true;
        }

        let moving = false;
        if (keys["ArrowRight"] && !keys["ArrowLeft"]) {
            this.direction = "right";
            this.xPos += this.speed;
            moving = true;
        } else if (keys["ArrowLeft"] && !keys["ArrowRight"]) {
            this.direction = "left";
            this.xPos -= this.speed;
            moving = true;
        }

        this.keepOnDeck(this.decks[this.currentDeck]);

        if (upPressed && !this.previousUp) {
            moving = this.useLadder(true) || moving;
        } else if (downPressed && !this.previousDown) {
            moving = this.useLadder(false) || moving;
        }

        this.previousUp = upPressed;
        this.previousDown = downPressed;

        if (moving) {
            this.animate();
        } else {
            this.direction = "front";
            this.currentFrame = 0;
            this.animationCounter = 0;
        }
        return moving;
    }

    keepOnDeck(deck) {
        this.xPos = Math.max(
            deck.startPoint,
            Math.min(this.xPos, deck.endPoint - this.width)
        );
    }

    useLadder(goingUp) {
        const centerX = this.xPos + this.width / 2;
        let nearestLadder = null;
        let nearestDistance = this.distanceToLadder + 1;

        for (const ladder of this.ladders) {
            const startingDeck = goingUp ? ladder.bottomPoint : ladder.topPoint;
            const distance = Math.abs(centerX - ladder.x);
            if (startingDeck === this.currentDeck && distance <= this.distanceToLadder && distance < nearestDistance) {
                nearestLadder = ladder;
                nearestDistance = distance;
            }
        }

        if (!nearestLadder) return false;

        this.targetDeck = goingUp ? nearestLadder.topPoint : nearestLadder.bottomPoint;
        this.xPos = nearestLadder.x - this.width / 2;
        this.direction = "up";
        this.climbing = true;
        this.currentFrame = 0;
        this.animationCounter = 0;
        return true;
    }

    climb() {
        const targetY = this.decks[this.targetDeck].y - this.height;
        const distance = targetY - this.yPos;
        this.direction = "up";
        this.animate();

        if (Math.abs(distance) <= this.climbSpeed) {
            this.yPos = targetY;
            this.currentDeck = this.targetDeck;
            this.climbing = false;
            this.targetDeck = null;
            this.direction = "front";
            this.currentFrame = 0;
            this.animationCounter = 0;
        } else {
            this.yPos += Math.sign(distance) * this.climbSpeed;
        }
    }

    animate() {
        this.animationCounter++;
        if (this.animationCounter >= 5) {
            this.currentFrame = (this.currentFrame + 1) % 4;
            this.animationCounter = 0;
        }
    }

    draw() {
        if (!this.image.complete || this.image.naturalWidth === 0) return;

        let row = 0;
        if (this.direction === "left") row = 1;
        else if (this.direction === "right") row = 2;
        else if (this.direction === "up") row = 3;

        const frame = this.animationData.fl1nk_frames[row * 4 + this.currentFrame];
        if (!frame) return;

        const width = frame.position.width * this.scale;
        const height = frame.position.height * (this.height / 256);

        this.context.drawImage(
            this.image,
            frame.position.x,
            frame.position.y,
            frame.position.width,
            frame.position.height,
            this.xPos + (this.width - width) / 2,
            this.yPos + this.height - height,
            width,
            height
        );
    }
}
