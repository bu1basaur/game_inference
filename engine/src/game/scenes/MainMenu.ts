import { GameObjects, Scene } from "phaser";

import { EventBus } from "../../events/EventBus";
import { useGameStore } from "../../stores/useGameStore";
import { GAME_EVT } from "../../events/GameEvt";
import { Dialogue } from "../systems/Dialogue";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";

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

        // zustand 상태관리 테스트용
        clickMe.on("pointerdown", () => {
            // 핵심: React 훅이 아닌 일반 JS 함수처럼 getState()를 통해 접근
            useGameStore.getState().increaseScore(10);

            // 간단한 효과
            this.tweens.add({
                targets: clickMe,
                scale: 1.2,
                duration: 100,
                yoyo: true,
            });
        });

        // 테스트용 게임 시작 버튼
        const startBtn = this.add
            .text(400, 500, "GAME START", {
                fontSize: "56px",
                color: "#ffcc00",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        startBtn.on("pointerdown", () => {
            this.changeScene();
        });

        // 테스트용 Spine 애니메이션 추가
        const spineObject = this.add.spine(
            -200,
            -300,
            "nyangi",
            "nyangi-atlas"
        );
        if (spineObject && spineObject.skeleton && spineObject.animationState) {
            // 애니메이션 재생 (trackIndex: 0, animationName: "idle_1", loop: true)
            spineObject.animationState.setAnimation(0, "idle_1", true);
        }

        EventBus.emit(GAME_EVT.SCENE_READY, this);

        // 테스트용 다이얼로그
        const dialogue = new BBCodeText(this, 400, 800, "", {
            fontFamily: "Boardmarker",
            fontSize: "48px",
            wrap: { mode: "word", width: 1200 },
        });
        this.add.existing(dialogue);

        const typewriter = new Dialogue(this, dialogue);

        typewriter.play(
            "이렇게 끔찍한 현장이라니... 어쩐지 짐작가는 사람이 있습니다. 바로 우리 동네 [color=#ff1111]도서관 사서 사서강씨[/color]예요.\n비록 심증이긴 하지만요.",
            {
                speed: 40,
                // onChar: () => this.sound.play("typing", { volume: 0.2 }),
                onComplete: () => {
                    console.log("대사 끝!");
                    // 선택지 활성화 등
                },
            }
        );
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Preloader");
    }
}
