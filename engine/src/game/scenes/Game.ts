// ──────────────────────────────────────────────────
// # 메인 게임 씬 (인게임 전체 로직)
// ──────────────────────────────────────────────────

import { Scene } from "phaser";

import { StoryManager } from "../../systems/StoryManager";
import { DialogueManager } from "../../systems/DialogueManager";
import { TimelineManager } from "../../systems/TimelineManager";

import { TIMELINE_EVENTS } from "../data/Timeline";
import { ClockDisplay } from "../objects/ClockDisplay";
import { CharacterManager } from "../../systems/CharacterManager";

import { Calculator } from "../objects/Calculator";
import { Board } from "../objects/Board";
import { Inventory } from "../objects/Inventory";
import { Receipt } from "../objects/Receipt";
import { Notebook } from "../objects/Notebook";
import { WorkLog } from "../objects/WorkLog";
import { GameEventHandler } from "../../systems/GameEventHandler";
import {
    registerListeners,
    unregisterListeners,
} from "../../systems/GameListeners";
import { GameTimelineHandler } from "../../systems/GameTimelineHandler";
import { GamePauseController } from "../../systems/GamePauseController";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";
import { useSaveStore } from "../../stores/useSaveStore";
import { useNoteStore } from "../../stores/useNoteStore";
import { useAuthStore } from "../../stores/useAuthStore";

export class Game extends Scene {
    // ESC입력 시 일시정지 & 재개
    private escKey!: Phaser.Input.Keyboard.Key;

    public storyManager!: StoryManager;
    public characterManager: CharacterManager;
    public dialogueManager!: DialogueManager;
    public timelineManager!: TimelineManager;
    public clockDisplay: ClockDisplay;

    private eventHandler: GameEventHandler;
    public timelineHandler: GameTimelineHandler;
    public pauseControl: GamePauseController;

    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        this.add.image(960, 540, "bg");

        // 매니저 초기화
        this.characterManager = new CharacterManager(this);
        this.storyManager = await StoryManager.load("/assets/story/main.json");
        this.dialogueManager = new DialogueManager(this);
        this.timelineManager = new TimelineManager();
        this.clockDisplay = new ClockDisplay(this);

        // 게임 이벤트 핸들러 등록
        this.timelineHandler = new GameTimelineHandler(this);
        this.pauseControl = new GamePauseController(this);
        this.eventHandler = new GameEventHandler(
            this,
            this.characterManager,
            this.dialogueManager
        );
        registerListeners(this, this.timelineManager);

        // 타임라인 이벤트 일괄 등록
        this.timelineManager.registerAll(TIMELINE_EVENTS);

        // ESC
        this.escKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        // 게임 내 오브젝트 생성
        this.createObjects();

        // 불러오기 데이터가 있으면 복원
        this.applyPendingLoad();

        EventBus.emit(GAME_EVT.SCENE_READY, this);

        // 원하는 씬부터 테스트 - data > Timeline 내부 이벤트 참고 !
        // this.test("scene_radio_news", 8, 0, true);
    }

    update(_: number, delta: number) {
        if (!this.timelineManager) return;

        this.timelineManager.tick(delta);

        // 시간 업데이트
        const { hour, minute } = this.timelineManager.getTime();
        this.clockDisplay.update(hour, minute);

        // ESC 체크
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.pauseControl.toggle();
        }
    }

    /** 게임 오브젝트 생성 */
    private createObjects() {
        const calculator = new Calculator(this);
        calculator.show();

        const board = new Board(this);
        board.show();

        new Inventory(this);
        new Receipt(this);
        new Notebook(this);
        new WorkLog(this);
    }

    /** 타임라인 이벤트 발생 */
    public onTimelineEvent(eventkey: string) {
        this.timelineHandler.handle(eventkey);
    }

    /** 게임 재개 */
    public resumeGame() {
        this.pauseControl.resume();
    }

    /** 다음 스토리 진행 */
    public advanceStory() {
        this.timelineManager.slowDown();

        const step = this.storyManager.next();

        if (!step) {
            this.dialogueManager.setVisible(false);
            this.timelineManager.resume();
            return;
        }

        // 이벤트 처리
        this.eventHandler.handleAll(step.events).then(() => {
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
                            this.timelineManager.pause();
                            this.dialogueManager.showChoices(
                                step.choices,
                                (i) => {
                                    this.storyManager.choose(i);
                                    this.timelineManager.slowDown();
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

    /** 저장 데이터 복원 */
    private applyPendingLoad() {
        const save = useSaveStore.getState().pendingLoad;
        if (!save) return;

        this.storyManager.loadStateJson(save.storyState);
        this.timelineManager.restoreSnapshot(save.timelineMinutes);
        useNoteStore.getState().setNotes(save.notes);
        if (save.playerName) {
            useAuthStore.getState().setName(save.playerName);
        }

        useSaveStore.getState().clearPendingLoad();

        console.log("=== 불러오기 완료 ===");
        console.log("플레이어:", save.playerName ?? "(없음)");
        console.log(
            "게임 시간:",
            `${Math.floor(save.timelineMinutes / 60)}:${String(
                Math.round(save.timelineMinutes % 60)
            ).padStart(2, "0")}`
        );
        console.log("수집 쪽지:", save.notes.length, "개");
    }

    /** 모든 게임 이벤트 제거 */
    shutdown() {
        unregisterListeners(this);
        EventBus.removeAllListeners(GAME_EVT.TIMELINE);
        EventBus.removeAllListeners(GAME_EVT.GOTO_MAIN);
    }

    /** 씬 전환 */
    changeScene() {
        this.scene.start("GameOver");
    }

    /** 테스트용
     * @param event "scene_radio_news" 이벤트명
     * @param hour 해당 이벤트 시작 시간
     * @param minute 해당 이벤트 시작 분
     * @param runPrev 이전 이벤트 모두 실행
     */
    private async test(
        event: string,
        hour: number,
        minute: number,
        runPrev: boolean
    ) {
        if (import.meta.env.DEV) {
            const { GameDebugger } = await import("../debug/GameDebugger");
            const debug = new GameDebugger(this);
            debug.startFrom(event, hour, minute, runPrev);
        }
    }
}
