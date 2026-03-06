import { EventBus } from "../../events/EventBus";
import { Scene } from "phaser";
import { GAME_EVT } from "../../events/GameEvt";

import { StoryManager } from "../../systems/StoryManager";
import { DialogueManager } from "../../systems/DialogueManager";
import { TimelineManager } from "../../systems/TimelineManager";

import { TIMELINE_EVENTS } from "../data/Timeline";

export class Game extends Scene {
    // ESC입력 시 일시정지 & 재개
    private escKey!: Phaser.Input.Keyboard.Key;
    private isPaused = false;

    private storyManager!: StoryManager;
    private dialogueManager!: DialogueManager;
    private timelineManager!: TimelineManager;

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

    async create() {
        this.add.image(960, 540, "bg");
        // this.test();

        // 매니저 초기화
        this.storyManager = await StoryManager.load("/assets/story/main.json");
        this.dialogueManager = new DialogueManager(this);
        this.timelineManager = new TimelineManager();

        // 타임라인 이벤트 일괄 등록
        this.timelineManager.registerAll(TIMELINE_EVENTS);

        // 원하는 씬부터 테스트
        // this.debugStartFrom("scene_homeless", 7, 30);

        // 타임라인 이벤트 수신
        EventBus.on(GAME_EVT.TIMELINE, this.onTimelineEvent, this);

        // ESC
        this.escKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );
        EventBus.on(GAME_EVT.RESUME, this.resumeGame, this);
    }

    update(_: number, delta: number) {
        this.timelineManager.tick(delta);

        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.isPaused ? this.resumeGame() : this.pauseGame();
        }
    }

    /** 타임라인에 맞는 이벤트 호출 */
    private onTimelineEvent(eventKey: string) {
        if (eventKey === "shop_close") {
            // 영업 종료 처리
            return;
        }
        this.storyManager.jumpTo(eventKey);
        this.dialogueManager.setVisible(true);
        this.timelineManager.pause(); // 대화 시작 → 시간 정지
        this.advanceStory();
    }

    /** 다음 스토리 진행 */
    private advanceStory() {
        const step = this.storyManager.next();

        if (!step) {
            this.dialogueManager.setVisible(false);
            this.timelineManager.resume();
            return;
        }

        step.events.forEach((evt) => this.handleEvent(evt));

        if (step.text) {
            this.dialogueManager.show(step, () => {
                if (step.choices.length > 0) {
                    this.dialogueManager.showChoices(step.choices, (i) => {
                        this.storyManager.choose(i);
                        this.advanceStory();
                    });
                } else {
                    this.input.once("pointerdown", () => this.advanceStory());
                }
            });
        } else if (step.choices.length > 0) {
            this.dialogueManager.showChoices(step.choices, (i) => {
                this.storyManager.choose(i);
                this.advanceStory();
            });
        }
    }

    /** 대화 중 이벤트 처리 메서드 */
    private handleEvent(event: string) {
        switch (event) {
            // 캐릭터 등장/퇴장
            case "char_show":
                // this.characterManager.show(...)
                console.log("캐릭터 등장");
                break;
            case "char_hide":
                // this.characterManager.hide(...)
                console.log("캐릭터 퇴장");
                break;

            // 효과음
            case "sfx_bell":
                // this.sound.play("bell");
                console.log("효과음: 벨");
                break;
            case "sfx_radio":
                // this.sound.play("radio");
                console.log("효과음: 라디오");
                break;

            // 배경 전환
            case "bg_change":
                // this.background.setTexture(...)
                console.log("배경 전환");
                break;

            default:
                console.warn("알 수 없는 이벤트:", event);
                break;
        }
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

    /**
     * 테스트용 - 원하는 씬부터 시작
     * @param knot ink knot 이름 (예: "scene_homeless", "scene_radio_news")
     * @param timeHour 시작 시간 hour (예: 7)
     * @param timeMinute 시작 시간 minute (예: 30)
     */
    private debugStartFrom(
        knot: string,
        timeHour?: number,
        timeMinute?: number
    ) {
        // 시간 강제 설정
        if (timeHour !== undefined) {
            this.timelineManager.setTime(timeHour, timeMinute ?? 0);
        }

        // 해당 knot으로 점프해서 대화 시작
        this.storyManager.jumpTo(knot);
        this.dialogueManager.setVisible(true);
        this.timelineManager.pause();
        this.advanceStory();
    }
}
