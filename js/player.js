
"use strict";

class PlayerAnimator {
    constructor() {
        this.frames = {
            idle: [],
            left: [],
            right: [],
            up: [],
            down: [],
            climb: []
        };

        this.currentAnimation = "idle";
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 120;

        this.loadFrames();
    }

    loadFrames() {
        const animations = {
            idle: 4,
            left: 8,
            right: 8,
            up: 8,
            down: 8,
            climb: 8
        };

        for (const animation in animations) {
            for (let i = 1; i <= animations[animation]; i++) {
                const image = new Image();

                image.src =
                    `assets/images/player-frames/${this.getFilename(animation, i)}`;

                this.frames[animation].push(image);
            }
        }
    }

    getFilename(animation, number) {
        const names = {
            idle: "idle",
            left: "walk-left",
            right: "walk-right",
            up: "walk-up",
            down: "walk-down",
            climb: "climb"
        };

        return `${names[animation]}-${String(number).padStart(2, "0")}.png`;
    }

    setAnimation(animation) {
        if (this.currentAnimation !== animation) {
            this.currentAnimation = animation;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    draw(ctx, x, y, width, height, animation, moving) {
        if (!moving) {
            animation = "idle";
        }

        this.setAnimation(animation);

        const frames = this.frames[this.currentAnimation];

        if (!frames || frames.length === 0) {
            return;
        }

        const image = frames[this.currentFrame];

        if (image && image.complete && image.naturalWidth > 0) {
            ctx.drawImage(image, x, y, width, height);
        }

        if (moving) {
            this.frameTimer++;

            if (this.frameTimer >= 7) {
                this.currentFrame =
                    (this.currentFrame + 1) % frames.length;

                this.frameTimer = 0;
            }
        }
    }
}

window.PlayerAnimator = PlayerAnimator;
