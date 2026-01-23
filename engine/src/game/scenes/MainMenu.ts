import { GameObjects, Scene } from "phaser";

import { EventBus } from "../events/EventBus";
import { useGameStore } from "../../stores/useGameStore";
import { GAME_EVT } from "../events/GameEvent";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    preload() {
        // Spine 애니메이션 로드
        this.load.spineBinary("nyangi", "assets/spine/nyangi/nyangi.skel");
        this.load.spineAtlas(
            "nyangi-atlas",
            "assets/spine/nyangi/nyangi.atlas"
        );
    }

    create() {
        // 중앙에 클릭할 수 있는 텍스트 생성
        const clickMe = this.add
            .text(400, 300, "CLICK ME!", { fontSize: "48px", color: "#ffffff" })
            .setOrigin(0.5)
            .setInteractive();

        clickMe.on("pointerdown", () => {
            // ✅ 핵심: React 훅이 아닌 일반 JS 함수처럼 getState()를 통해 접근
            useGameStore.getState().increaseScore(10);

            // 간단한 효과
            this.tweens.add({
                targets: clickMe,
                scale: 1.2,
                duration: 100,
                yoyo: true,
            });
        });

        // Spine 애니메이션 추가
        const spineObject = this.add.spine(0, 0, "nyangi", "nyangi-atlas");
        if (spineObject && spineObject.skeleton && spineObject.animationState) {
            // 애니메이션 재생 (trackIndex: 0, animationName: "idle_1", loop: true)
            spineObject.animationState.setAnimation(0, "idle_1", true);
        }

        EventBus.emit(GAME_EVT.SCENE_READY, this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}
