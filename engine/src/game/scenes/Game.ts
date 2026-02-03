import { EventBus } from "../../events/EventBus";
import { Scene } from "phaser";
import { GAME_EVT } from "../../events/GameEvt";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;

        this.gameText = this.add
            .text(
                512,
                384,
                "Make something fun!\nand share it with us:\nsupport@phaser.io",
                {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit(GAME_EVT.SCENE_READY, this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
