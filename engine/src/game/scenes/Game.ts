import { EventBus } from "../../events/EventBus";
import { Scene } from "phaser";
import { GAME_EVT } from "../../events/GameEvt";

import { StoryManager } from "../../systems/StoryManager";
import { DialogueManager } from "../../systems/DialogueManager";
import { TimelineManager } from "../../systems/TimelineManager";

import { TIMELINE_EVENTS } from "../data/Timeline";
import { ClockDisplay } from "../../systems/ClockDisplay";
import { BirdPoo } from "../objects/BirdPoo";
import { CHARACTERS } from "../data/Characters";
import { CharacterManager } from "../../systems/CharacterManager";

export class Game extends Scene {
    // ESC입력 시 일시정지 & 재개
    private escKey!: Phaser.Input.Keyboard.Key;
    private isPaused = false;

    private storyManager!: StoryManager;
    private characterManager: CharacterManager;
    private dialogueManager!: DialogueManager;
    private timelineManager!: TimelineManager;
    private clockDisplay: ClockDisplay;

    private poo?: BirdPoo;

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
        this.characterManager = new CharacterManager(this);
        this.storyManager = await StoryManager.load("/assets/story/main.json");
        this.dialogueManager = new DialogueManager(this);
        this.timelineManager = new TimelineManager();
        this.clockDisplay = new ClockDisplay(this);

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

        // 시간 업데이트
        const { hour, minute } = this.timelineManager.getTime();
        this.clockDisplay.update(hour, minute);

        // ESC 체크
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.isPaused ? this.resumeGame() : this.pauseGame();
        }
    }

    /** 타임라인에 맞는 이벤트 필요시 호출 */
    private onTimelineEvent(eventKey: string) {
        if (eventKey === "scene_open") {
            this.poo = new BirdPoo(this);
            this.poo.show();
        }

        if (eventKey === "fly_add") {
            this.poo?.addFly();
            return;
        }

        // 영업 종료 처리
        if (eventKey === "shop_close") {
            return;
        }
        console.log("이벤트키: " + eventKey);

        this.storyManager.jumpTo(eventKey);
        this.timelineManager.pause();
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

        // 이벤트 처리
        this.handleEvents(step.events).then(() => {
            if (!step.text && step.choices.length === 0) {
                this.advanceStory();
                return;
            }

            if (step.text) {
                const hasChoices = step.choices.length > 0;

                this.dialogueManager.show(
                    step,
                    () => {
                        if (hasChoices) {
                            // 대사 끝난 후 선택지 표시 (자동넘김/클릭 없이)
                            this.dialogueManager.showChoices(
                                step.choices,
                                (i) => {
                                    this.storyManager.choose(i);
                                    this.advanceStory();
                                }
                            );
                        } else {
                            // 선택지 없으면 자동넘김
                            this.advanceStory();
                        }
                    },
                    !hasChoices
                );
                return;
            }

            // 텍스트 없이 선택지만 있는 경우
            if (step.choices.length > 0) {
                this.dialogueManager.showChoices(step.choices, (i) => {
                    this.storyManager.choose(i);
                    this.advanceStory();
                });
                return;
            }

            // 텍스트도 선택지도 없고 이벤트만 있는 경우 → 자동으로 다음으로
            this.advanceStory();
        });
    }

    /** 이벤트 배열 순차 처리 */
    private async handleEvents(events: string[]): Promise<void> {
        for (const evt of events) {
            await this.handleEvent(evt);
        }
    }

    /** 대화 중 이벤트 처리 메서드 */
    private async handleEvent(event: string): Promise<void> {
        const [type, ...args] = event.split(":");

        switch (type) {
            // 캐릭터
            case "char_enter": {
                const [id] = args;
                const config = CHARACTERS[id];
                if (config) await this.characterManager.enter(id, config);
                break;
            }
            case "char_exit": {
                const [id] = args;
                this.dialogueManager.setVisible(false);
                await this.characterManager.exit(id);
                break;
            }
            case "char_anim": {
                const [id, anim, loopStr] = args;
                const loop = loopStr !== "false";
                this.characterManager.setAnim(id, anim, loop);
                break;
            }

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
