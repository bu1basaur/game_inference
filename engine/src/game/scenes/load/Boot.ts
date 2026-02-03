import { Scene } from "phaser";

/** 메인 메뉴 진입 전 완전 최초 로드 */
export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.image("background", "assets/bg.png");

        // 간단한 프로그레스 바
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.load.on("progress", (progress: number) => {
            bar.width = 4 + 460 * progress;
        });
    }

    async create() {
        this.loadAssets();
        await this.loadFont();
        this.sceneStart();
    }

    /** 애셋 로드 */
    private async loadAssets() {}

    /** 폰트 로드 */
    private async loadFont() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/font/font.css";
        document.head.appendChild(link);

        await document.fonts.load('24px "Boardmarker"');
    }

    /** 씬 시작 */
    private sceneStart() {
        this.scene.start("MainMenu");
    }
}
