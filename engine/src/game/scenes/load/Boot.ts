import { Scene } from "phaser";

/** 메인 메뉴 진입 전 완전 최초 로드 */
export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // progress bar
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.add
            .rectangle(centerX, centerY, 468, 32)
            .setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(centerX - 230, centerY, 4, 28, 0xffffff);
        this.load.on("progress", (progress: number) => {
            bar.width = 4 + 460 * progress;
        });

        this.loadAssets();
    }

    async create() {
        await this.loadFont();
        this.sceneStart();
    }

    /** 애셋 로드 */
    private loadAssets() {
        this.load.image("bg", "assets/common/images/bg.png");
    }

    /** 폰트 로드 */
    private async loadFont() {
        await new Promise<void>((resolve) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/assets/font/font.css";
            link.onload = () => resolve();
            document.head.appendChild(link);
        });

        await document.fonts.load('24px "Boardmarker"');
        await document.fonts.load('24px "Bunpil"');
        await document.fonts.load('24px "ByeolbichhaneulL"');
        await document.fonts.load('24px "ByeolbichhaneulB"');
        await document.fonts.load('24px "Dotbogi"');
        await document.fonts.load('24px "Jayeon"');
        await document.fonts.load('24px "Kkokkoma"');
        console.log("폰트 로드 완료");
    }

    /** 씬 시작 */
    private sceneStart() {
        // this.scene.start("MainMenu");
        this.scene.start("Preloader");
    }
}
