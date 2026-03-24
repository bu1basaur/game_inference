import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class Trash {
    private scene: Phaser.Scene;
    private trash?: Phaser.GameObjects.Image;
    private note?: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /** 쓰레기 등장 */
    show(x: number, y: number) {
        this.trash = this.scene.add
            .image(x, y, "trash")
            .setScale(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        this.trash.on("pointerdown", () => {
            // EventBus.emit(GAME_EVT.POPUP_OPEN);
            this.openNote();
        });
    }

    /** 쪽지 표시 */
    private openNote() {
        this.trash?.destroy();

        const noteIndex = Phaser.Math.Between(1, 6);
        const imageKey = `note_${noteIndex}`;
        EventBus.emit(GAME_EVT.POPUP_OPEN);
        EventBus.emit(GAME_EVT.NOTE_OPEN, { imageKey });
    }

    destroy() {
        this.trash?.destroy();
        this.note?.destroy();
    }
}
