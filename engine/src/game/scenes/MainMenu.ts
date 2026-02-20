import { GameObjects, Scene } from "phaser";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const MENU_ITEMS = [
    { label: "GAME START", action: "start" },
    { label: "OPTION", action: "option" },
    { label: "EXIT", action: "exit" },
] as const;

type MenuAction = (typeof MENU_ITEMS)[number]["action"];

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        console.log("타이틀 생성");
        // 타이틀
        this.add
            .text(700, 320, "오만거때만거", {
                fontFamily: "Kkokkoma",
                fontSize: "120px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // 메뉴 버튼
        const startX = 150;
        const startY = 640;
        const gap = 110;

        MENU_ITEMS.forEach(({ label, action }, i) => {
            this.createMenuButton(label, startX, startY + gap * i, action);
        });

        EventBus.emit(GAME_EVT.SCENE_READY, this);
    }

    private createMenuButton(
        label: string,
        x: number,
        y: number,
        action: MenuAction
    ) {
        console.log("메인 게임 시작 내용");

        const btn = this.add
            .text(x, y, label, {
                fontFamily: "Bunpil",
                fontSize: "60px",
                color: "#ffffff",
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        btn.on("pointerover", () => btn.setColor("#ffcc00"));
        btn.on("pointerout", () => btn.setColor("#ffffff"));
        btn.on("pointerdown", () => this.handleMenuAction(action));

        return btn;
    }

    private handleMenuAction(action: MenuAction) {
        switch (action) {
            case "start":
                this.scene.start("Preloader");
                break;
            case "option":
                // 추후 옵션창 추가
                // EventBus.emit(GAME_EVT.OPEN_OPTION);
                break;
            case "exit":
                // 게임 종료 처리
                // EventBus.emit(GAME_EVT.EXIT);
                break;
        }
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Preloader");
    }
}
