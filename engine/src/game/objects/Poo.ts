export class Poo {
    private scene: Phaser.Scene;
    private poo?: Phaser.GameObjects.Image;
    private flies: Phaser.GameObjects.Image[] = [];
    private removed = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    show() {
        this.poo = this.scene.add
            .image(1020, 660, "poo")
            .setInteractive({ useHandCursor: true })
            .once("pointerdown", () => this.remove());
    }

    remove() {
        if (this.removed) return;
        this.removed = true;
        this.poo?.destroy();
        this.poo = undefined;
        this.clearFlies();
    }

    addFly() {
        if (this.removed || !this.poo) return;

        const fly = this.scene.add
            .image(
                this.poo.x + Phaser.Math.Between(-20, 20),
                this.poo.y + Phaser.Math.Between(-20, 20),
                "fly"
            )
            .setAlpha(0)
            .setInteractive({ useHandCursor: true })
            .once("pointerdown", () => this.removeFly(fly));

        // 페이드인 후 움직임 시작
        this.scene.tweens.add({
            targets: fly,
            alpha: 1,
            duration: 800,
            onComplete: () => this.startFlyMovement(fly),
        });

        this.flies.push(fly);
    }

    private startFlyMovement(fly: Phaser.GameObjects.Image) {
        const W = this.scene.scale.width;
        const H = this.scene.scale.height;

        const moveToRandom = () => {
            if (!fly.active) return;

            if (Phaser.Math.Between(0, 100) < 25) {
                this.scene.time.delayedCall(
                    Phaser.Math.Between(800, 1800),
                    moveToRandom
                );
                return;
            }

            const targetX = Phaser.Math.Between(100, W - 100);
            const targetY = Phaser.Math.Between(100, H - 100);
            const controlX =
                (fly.x + targetX) / 2 + Phaser.Math.Between(-200, 200);
            const controlY =
                (fly.y + targetY) / 2 + Phaser.Math.Between(-200, 200);
            const startX = fly.x;
            const startY = fly.y;

            this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: Phaser.Math.Between(1500, 3500),
                ease: "Cubic.easeInOut",
                onUpdate: (tween) => {
                    const t = tween.getValue()!;
                    const x = Phaser.Math.Interpolation.Bezier(
                        [startX, controlX, targetX],
                        t
                    );
                    const y = Phaser.Math.Interpolation.Bezier(
                        [startY, controlY, targetY],
                        t
                    );
                    const angle = Phaser.Math.Angle.Between(fly.x, fly.y, x, y);
                    fly.setRotation(angle + Math.PI / 2);
                    fly.setPosition(x, y);
                },
                onComplete: () => {
                    this.scene.time.delayedCall(
                        Phaser.Math.Between(100, 600),
                        moveToRandom
                    );
                },
            });
        };

        // 날개짓
        this.scene.tweens.add({
            targets: fly,
            scale: 0.9,
            duration: 50,
            yoyo: true,
            repeat: -1,
        });

        // 처음엔 멈춰있다가 시작
        this.scene.time.delayedCall(Phaser.Math.Between(800, 2500), () =>
            moveToRandom()
        );
    }

    private fadeFly(fly: Phaser.GameObjects.Image, onDone?: () => void) {
        this.scene.tweens.killTweensOf(fly);
        this.scene.tweens.add({
            targets: fly,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                fly.destroy();
                onDone?.();
            },
        });
    }

    private removeFly(fly: Phaser.GameObjects.Image) {
        this.flies = this.flies.filter((f) => f !== fly);
        this.fadeFly(fly);
        console.log(`파리 제거, 남은 파리: ${this.flies.length}마리`);
    }

    clearFlies() {
        this.flies.forEach((fly) => this.fadeFly(fly));
        this.flies = [];
    }

    isRemoved() {
        return this.removed;
    }

    getFlyCount() {
        return this.flies.length;
    }

    destroy() {
        this.poo?.destroy();
        this.clearFlies();
    }
}
