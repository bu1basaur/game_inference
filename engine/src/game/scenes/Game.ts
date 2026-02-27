import { EventBus } from "../../events/EventBus";
import { Scene } from "phaser";
import { GAME_EVT } from "../../events/GameEvt";

import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { Dialogue } from "../../systems/Dialogue";

export class Game extends Scene {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.Image;

    // ESC입력 시 일시정지 & 재개
    private escKey!: Phaser.Input.Keyboard.Key;
    private isPaused = false;

    constructor() {
        super("Game");
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
        this.add.image(960, 540, "bg");
        this.test();

        // ESC 키 등록
        this.escKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        // Resume 이벤트 수신 (React UI에서 재개 버튼 누를 때)
        EventBus.on(GAME_EVT.RESUME, this.resumeGame, this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.isPaused ? this.resumeGame() : this.pauseGame();
        }
    }

    private test() {
        // 테스트용 Spine 애니메이션 추가
        const spineObject = this.add.spine(
            -200,
            -100,
            "nyangi",
            "nyangi-atlas"
        );
        if (spineObject && spineObject.skeleton && spineObject.animationState) {
            // 애니메이션 재생 (trackIndex: 0, animationName: "idle_1", loop: true)
            spineObject.animationState.setAnimation(0, "idle_1", true);
        }

        EventBus.emit(GAME_EVT.SCENE_READY, this);

        // 테스트용 다이얼로그
        const dialogue = new BBCodeText(this, 400, 700, "", {
            fontFamily: "Bunpil",
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

    private pauseGame() {
        this.isPaused = true;

        // Spine 애니메이션 포함 모든 씬 일시정지
        this.scene.pause();

        // 오디오 일시정지
        // this.sound.pauseAll();

        // React에 알림
        EventBus.emit(GAME_EVT.PAUSE);
    }

    private resumeGame() {
        this.isPaused = false;
        this.scene.resume();
        this.sound.resumeAll();
        EventBus.emit(GAME_EVT.RESUMED);
    }

    shutdown() {
        EventBus.off(GAME_EVT.RESUME, this.resumeGame, this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
