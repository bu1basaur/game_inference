// ──────────────────────────────────────────────────
// # 최초 부팅 씬 (메인 메뉴 진입을 위한 최소 리소스 로드)
// ──────────────────────────────────────────────────

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
            this.tweens.add({
            targets: bar,
            width: 4 + 460 * progress,
            duration: 150,
            ease: "Linear",
            });
        });

        // 로드 상태 텍스트
        const statusMessages = [
            "오늘의 영업을 준비중입니다.",
            "진열대를 정리하는 중입니다.",
            "가게의 불을 켜는 중입니다.",
            "먼지를 털어내고 있습니다.",
            "거리의 소음을 모으는 중입니다.",
            "손님들을 맞이할 준비 중입니다.",
            "문너머에서 발소리가 들립니다.",
            "단골손님을 부르는 중입니다.",
            "기억을 정리하는 중입니다.",
            "계산기를 두드리는 중입니다.",
        ];

        const statusText = this.add
            .text(centerX, centerY + 100, "", {
                fontFamily: "sans-serif",
                fontSize: "24px",
                color: "#aaaaaa",
            })
            .setOrigin(0.5);
        
            statusText.setText(Phaser.Math.RND.pick(statusMessages));

        // let lastFileKey = "";
        // this.load.on("fileprogress", (file: Phaser.Loader.File) => {
        //     if (file.key === lastFileKey) return;
        //     lastFileKey = file.key;
        //     statusText.setText(Phaser.Math.RND.pick(statusMessages));
        // });

        this.loadAssets();
    }

    async create() {
        await this.loadFont();
        this.sceneStart();
    }

    /** 애셋 로드 */
    private loadAssets() {
        this.load.image("bg", "assets/common/images/bg.png");
        this.load.audio("main_bgm", "assets/game/sounds/main_bgm.mp3");
        this.load.audio("game_bgm", "assets/game/sounds/game_bgm.mp3");
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

        await document.fonts.load('24px "Bunpil"');
        await document.fonts.load('24px "Kkokkoma"');
        console.log("폰트 로드 완료");
    }

    /** 씬 시작 */
    private sceneStart() {
        this.scene.start("MainMenu");
        // this.scene.start("Preloader");
    }
}
