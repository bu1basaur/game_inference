export type DialogueOptions = {
    speed?: number; // 글자 속도 (ms)
    skippable?: boolean; // 클릭으로 스킵 가능 여부
    onStart?: () => void;
    onChar?: (char: string) => void;
    onComplete?: () => void;
};

export class Dialogue {
    private scene: Phaser.Scene;
    private target: any; // rexBBCodeText
    private timer?: Phaser.Time.TimerEvent;

    private fullText = "";
    private output = "";
    private index = 0;
    private isPlaying = false;

    constructor(scene: Phaser.Scene, target: any) {
        this.scene = scene;
        this.target = target;
    }

    /** 다이얼로그 출력 */
    play(text: string, options: DialogueOptions = {}) {
        this.stop();

        const {
            speed = 40,
            skippable = true,
            onStart,
            onChar,
            onComplete,
        } = options;

        this.fullText = text;
        this.output = "";
        this.index = 0;
        this.isPlaying = true;
        this.target.text = "";

        onStart?.();

        this.timer = this.scene.time.addEvent({
            delay: speed,
            loop: true,
            callback: () => {
                if (this.index >= this.fullText.length) {
                    this.finish(onComplete);
                    return;
                }

                const char = this.fullText[this.index];

                // BBCode 태그는 즉시 처리. 화면에 노출 X.
                if (char === "[") {
                    const close = this.fullText.indexOf("]", this.index);
                    if (close !== -1) {
                        this.output += this.fullText.slice(
                            this.index,
                            close + 1
                        );
                        this.index = close + 1;
                        this.target.text = this.output;
                        return;
                    }
                }

                // 일반 문자만 타이핑
                this.output += char;
                this.index++;
                this.target.text = this.output;
                onChar?.(char);
            },
        });

        if (skippable) {
            if (skippable) {
                // 한 프레임 뒤에 등록해서 현재 클릭 이벤트가 소비되지 않도록
                this.scene.time.delayedCall(100, () => {
                    this.scene.input.once("pointerdown", () => {
                        if (this.isPlaying) {
                            this.skip(onComplete);
                        }
                    });
                });
            }
        }
    }

    /** 다이얼로그 스킵 */
    skip(onComplete?: () => void) {
        this.stop();
        this.target.text = this.fullText;
        onComplete?.();
    }

    /** 다이얼로그 정지 */
    stop() {
        this.timer?.remove(false);
        this.timer = undefined;
        this.isPlaying = false;
    }

    private finish(onComplete?: () => void) {
        this.stop();
        this.target.text = this.fullText;
        onComplete?.();
    }

    get playing() {
        return this.isPlaying;
    }
}
