// ──────────────────────────────────────────────────
// # 대화창 표시/진행
// ──────────────────────────────────────────────────

import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { Dialogue } from "../game/objects/Dialogue";
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
    private autoToggleBtn: Phaser.GameObjects.Container;
    private spinnerRing: Phaser.GameObjects.Graphics;
    private spinnerTween?: Phaser.Tweens.Tween;

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

        // 자동 넘김 토글 버튼 (gradient ring spinner)
        const SPINNER_X = 1800;
        const SPINNER_Y = 850;
        const OUTER_R = 30;

        this.spinnerRing = this.scene.add.graphics();
        this.drawSpinnerRing(this.autoMode);

        this.autoToggleBtn = this.scene.add
            .container(SPINNER_X, SPINNER_Y, [this.spinnerRing])
            .setDepth(DEPTH)
            .setVisible(false)
            .setSize(OUTER_R * 2, OUTER_R * 2)
            .setInteractive({ useHandCursor: true });

        this.spinnerTween = this.scene.tweens.add({
            targets: this.autoToggleBtn,
            angle: 360,
            duration: 2500,
            repeat: -1,
            ease: "Linear",
            paused: !this.autoMode,
        });

        this.autoToggleBtn.on("pointerdown", () => {
            this.autoMode = !this.autoMode;
            if (this.autoMode) {
                this.drawSpinnerRing(true);
                this.spinnerTween?.resume();
            } else {
                this.spinnerTween?.pause();
                this.autoToggleBtn.setAngle(0);
                this.drawSpinnerRing(false);
            }

            // 수동 -> 자동 전환 시 대기 중인 콜백 있으면 바로 적용
            if (this.autoMode && this.dialogueComplete) {
                EventBus.emit(GAME_EVT.RESUME_DIALOGUE);

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

    
    /** 대화창 자동 넘김 on/off 상태 회전 스피너 */
    private drawSpinnerRing(gradient: boolean) {
        const STROKE_R = 27.75;
        const STROKE_W = 4.5;
        const STEPS = 60;
        this.spinnerRing.clear();

        if (gradient) {
            // 진회색(위) → 연회색(아래) 그라디언트
            const topColor = { r: 0x68, g: 0x68, b: 0x68 }; // rgba(68, 68, 68, 1)
            const botColor = { r: 0xbb, g: 0xbb, b: 0xbb }; // #bdbdbdff
            for (let i = 0; i < STEPS; i++) {
                const midAngle = (i + 0.5) * ((2 * Math.PI) / STEPS);
                const t = (Math.sin(midAngle) + 1) / 2;
                const r = Math.round(topColor.r + (botColor.r - topColor.r) * t);
                const g = Math.round(topColor.g + (botColor.g - topColor.g) * t);
                const b = Math.round(topColor.b + (botColor.b - topColor.b) * t);
                const color = (r << 16) | (g << 8) | b;
                const a1 = (i / STEPS) * 2 * Math.PI;
                const a2 = ((i + 1) / STEPS) * 2 * Math.PI;
                this.spinnerRing.lineStyle(STROKE_W, color, 1);
                this.spinnerRing.beginPath();
                this.spinnerRing.arc(0, 0, STROKE_R, a1, a2, false);
                this.spinnerRing.strokePath();
            }
        } else {
            // 정지 상태 → 단색 진회색
            this.spinnerRing.lineStyle(STROKE_W, 0x999999, 1);
            this.spinnerRing.strokeCircle(0, 0, STROKE_R);
        }
    }

    /** 대화창 보여주기 */
    show(step: StoryStep, onComplete?: () => void, autoNext: boolean = true, onTypingComplete?: () => void) {
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
                // 타이핑 완료 시 입 닫기 (클릭/자동넘김 대기 중)
                onTypingComplete?.();
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
                    EventBus.emit(GAME_EVT.WAIT_DIALOGUE);
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

    /** 대화창 완전 초기화 (타이핑 정지 + 선택지 제거 + 창 숨김) */
    reset() {
        this.typewriter.stop();
        this.clearChoices();
        this.setVisible(false);
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
