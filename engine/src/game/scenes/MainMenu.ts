import { GameObjects, Scene } from "phaser";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const MENU_ITEMS = [
    { label: "게임 시작", action: "start", x: 80, y: 690 },
    { label: "불러오기", action: "start", x: 80, y: 780 },
    { label: "옵션", action: "option", x: 80, y: 870 },
    { label: "나가기", action: "exit", x: 80, y: 960 },

    { label: "수집한 엔딩", action: "option", x: 1620, y: 800 },
    { label: "만든 사람들", action: "option", x: 1620, y: 890 },
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
            .text(700, 350, "소마소마", {
                fontFamily: "Kkokkoma",
                fontSize: "180px",
                color: "#ffffff",
                padding: { bottom: 20 },
            })
            .setOrigin(0.5);

        // 메뉴 버튼
        const gap = 90;

        MENU_ITEMS.forEach(({ label, action, x, y }, i) => {
            this.createMenuButton(label, x, y, action);
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
                fontSize: "54px",
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
