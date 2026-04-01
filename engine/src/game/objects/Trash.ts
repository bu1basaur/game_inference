// ──────────────────────────────────────────────────
// # 쓰레기 오브젝트
// ──────────────────────────────────────────────────

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
            // EventBus.emit(GAME_EVT.OPEN_POPUP);
            this.openNote();
        });
    }

    /** 쪽지 표시 */
    private openNote() {
        this.trash?.destroy();

        const noteIndex = Phaser.Math.Between(1, 6);
        const imageKey = `note_${noteIndex}`;
        EventBus.emit(GAME_EVT.OPEN_POPUP);
        EventBus.emit(GAME_EVT.OPEN_NOTE, { imageKey });
    }

    destroy() {
        this.trash?.destroy();
        this.note?.destroy();
    }
}
