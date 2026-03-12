import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { Dialogue } from "./Dialogue";
import { StoryStep } from "./StoryManager";

type BBCodeTextType = InstanceType<typeof BBCodeText>;

export class DialogueManager {
    private scene: Phaser.Scene;
    private typewriter: Dialogue;

    private dialogueBox: Phaser.GameObjects.Rectangle;
    private speakerBox: Phaser.GameObjects.Rectangle;
    private speakerText: Phaser.GameObjects.Text;
    private dialogueText: any;

    private choiceButtons: BBCodeTextType[] = [];

    private autoNextTimer?: Phaser.Time.TimerEvent;

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
                if (autoNext) {
                    // 대사 끝나고 2초 후 자동 넘김
                    this.autoNextTimer = this.scene.time.delayedCall(
                        2000,
                        () => {
                            onComplete?.();
                        }
                    );

                    // 화면 클릭시에도 대사 넘어감
                    this.dialogueBox.once("pointerdown", () => {
                        this.autoNextTimer?.remove(false);
                        this.autoNextTimer = undefined;
                        onComplete?.();
                    });
                } else {
                    onComplete?.();
                }
            },
        });
    }

    /** 자동 넘김 타이머 정리 */
    clearAutoNext() {
        this.autoNextTimer?.remove(false);
        this.autoNextTimer = undefined;
        this.dialogueBox.off("pointerdown");
    }

    /** 대화창 노출/숨김 */
    setVisible(visible: boolean) {
        if (!visible) this.clearAutoNext();
        this.dialogueBox.setVisible(visible);
        this.speakerBox.setVisible(visible);
        this.speakerText.setVisible(visible);
        this.dialogueText.setVisible(visible);
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
