// ──────────────────────────────────────────────────
// # 대화창 표시/진행
// ──────────────────────────────────────────────────

import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { Dialogue } from "./Dialogue";
import { StoryStep } from "./StoryManager";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";

type BBCodeTextType = InstanceType<typeof BBCodeText>;

export class DialogueManager {
    private scene: Phaser.Scene;
    private typewriter: Dialogue;

    private dialogueBox: Phaser.GameObjects.Rectangle;
    private speakerBox: Phaser.GameObjects.Rectangle;
    private speakerText: Phaser.GameObjects.Text;
    private dialogueText: any;

    private choiceButtons: BBCodeTextType[] = [];

    private autoMode: boolean = true; // 다이얼로그 자동 넘김 모드 설정
    private autoToggleBtn: Phaser.GameObjects.Image;

    private autoNextTimer?: Phaser.Time.TimerEvent;

    private dialogueComplete?: () => void;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.buildUI();
    }

    /** 대화창 기본 UI 세팅 */
    private buildUI() {
        const W = this.scene.scale.width;
        const H = this.scene.scale.height;
        const DEPTH = 100;

        // 다이얼로그 박스 (하단)
        this.dialogueBox = this.scene.add
            .rectangle(W / 2, H - 160, W - 80, 300, 0x000000, 0.8)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setInteractive()
            .setDepth(DEPTH);

        // 화자 이름 박스
        this.speakerBox = this.scene.add
            .rectangle(200, H - 330, 280, 60, 0x000000, 0.8)
            .setStrokeStyle(2, 0xffffff, 0.5)
            .setDepth(DEPTH);

        // 화자 이름 텍스트
        this.speakerText = this.scene.add
            .text(200, H - 332, "", {
                fontFamily: "Bunpil",
                fontSize: "32px",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setDepth(DEPTH);

        // 대사 텍스트
        this.dialogueText = new BBCodeText(this.scene, 100, H - 275, "", {
            fontFamily: "Bunpil",
            fontSize: "36px",
            color: "#ffffff",
            wrap: { mode: "word", width: W - 160 },
            lineSpacing: 6,
        });
        this.scene.add.existing(this.dialogueText);
        this.dialogueText.setDepth(DEPTH);

        this.typewriter = new Dialogue(
            this.scene,
            this.dialogueText,
            this.dialogueBox
        );

        // 자동 넘김 토글 버튼
        this.autoToggleBtn = this.scene.add
            .image(1800, 850, "loop_on")
            .setInteractive({ useHandCursor: true })
            .setDepth(DEPTH)
            .setScale(0.5, 0.5)
            .setVisible(false);

        this.autoToggleBtn.on("pointerdown", () => {
            this.autoMode = !this.autoMode;
            this.autoToggleBtn.setTexture(
                this.autoMode ? "loop_on" : "loop_off"
            );

            // 수동 -> 자동 전환 시 대기 중인 콜백 있으면 바로 적용
            if (this.autoMode && this.dialogueComplete) {
                EventBus.emit(GAME_EVT.DIALOGUE_RESUME);

                this.autoNextTimer = this.scene.time.delayedCall(2000, () => {
                    const callback = this.dialogueComplete;
                    this.dialogueComplete = undefined;
                    this.dialogueBox.off("pointerdown");
                    callback?.();
                });
            }

            // 자동 -> 수동 전환 시 타이머 취소
            if (!this.autoMode && this.autoNextTimer) {
                this.autoNextTimer.remove(false);
                this.autoNextTimer = undefined;
            }
        });
    }

    /** 대화창 보여주기 */
    show(step: StoryStep, onComplete?: () => void, autoNext: boolean = true) {
        this.setVisible(true);
        this.clearChoices();
        this.clearAutoNext();
        this.speakerText.setText(step.speaker ?? "");
        this.speakerBox.setVisible(!!step.speaker);

        // console.log(step.text);

        // 대사 타이핑
        this.typewriter.play(step.text, {
            speed: 40,
            onComplete: () => {
                // 선택지 있는 경우 즉시 onComplete (선택지 표시)
                if (!autoNext) {
                    onComplete?.();
                    return;
                }

                // 콜백 저장
                this.dialogueComplete = onComplete;

                // 수동이든 자동이든 클릭하면 넘어감
                this.dialogueBox.once("pointerdown", () => {
                    this.dialogueComplete = undefined;
                    onComplete?.();
                });

                // 자동 모드면 타이머도 시작
                if (this.autoMode) {
                    this.autoNextTimer = this.scene.time.delayedCall(
                        2000,
                        () => {
                            this.dialogueComplete = undefined;
                            this.dialogueBox.off("pointerdown");
                            onComplete?.();
                        }
                    );
                } else {
                    // 수동 모드 - 클릭 대기 중 시간 정지
                    console.log("로직 확인");
                    EventBus.emit(GAME_EVT.DIALOGUE_WAITING);
                }
            },
        });
    }

    /** 자동 넘김 타이머 정리 */
    clearAutoNext() {
        this.autoNextTimer?.remove(false);
        this.autoNextTimer = undefined;
        this.dialogueComplete = undefined;
        this.dialogueBox.off("pointerdown");
    }

    /** 대화창 노출/숨김 */
    setVisible(visible: boolean) {
        if (!visible) this.clearAutoNext();
        this.dialogueBox.setVisible(visible);
        this.speakerBox.setVisible(visible);
        this.speakerText.setVisible(visible);
        this.dialogueText.setVisible(visible);
        this.autoToggleBtn.setVisible(visible);
    }

    /** 대화창 하단 y값 반환 */
    getDialogueBottom(): number {
        const bounds = this.dialogueText.getBounds();
        return bounds.bottom;
    }

    /** 선택지 노출 */
    showChoices(choices: string[], onChoose: (index: number) => void) {
        this.clearChoices();
        const startY = this.getDialogueBottom() + 20;

        choices.forEach((text, i) => {
            const btn = new BBCodeText(
                this.scene,
                95,
                startY + i * 60,
                `▷ ${text}`,
                {
                    fontFamily: "Bunpil",
                    fontSize: "36px",
                    color: "#ffffff",
                    padding: { x: 16, y: 8 },
                    underline: {
                        color: "#FF9D40",
                        thickness: 3,
                        offset: 14,
                    },
                }
            )
                .setInteractive({ useHandCursor: true })
                .on("pointerover", () => {
                    btn.setText(`[color=#FF9D40]▶ [u]${text}[/u][/color]`);
                })
                .on("pointerout", () => {
                    btn.setText(`▷ ${text}`);
                })
                .on("pointerdown", () => {
                    this.clearChoices();
                    onChoose(i);
                });

            this.scene.add.existing(btn);
            btn.setDepth(100);
            this.choiceButtons.push(btn);
        });
    }

    /** 선택지 제거 */
    clearChoices() {
        this.choiceButtons.forEach((b) => b.destroy());
        this.choiceButtons = [];
    }
}
