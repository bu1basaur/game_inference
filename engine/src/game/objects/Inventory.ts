import { Scene } from "phaser";
import { EventBus } from "../../events/EventBus";

export class Inventory {
    constructor(scene: Scene) {
        const btn = scene.add.rectangle(1800, 80, 120, 120, 0x444444);

        btn.setInteractive();

        btn.on("pointerdown", () => {
            EventBus.emit("OPEN_INVENTORY");
        });

        const label = scene.add
            .text(1800, 80, "Inventory", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);
    }
}
