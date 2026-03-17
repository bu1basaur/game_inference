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

        this.trash.on("pointerdown", () => this.openNote());
    }

    /** 쪽지 표시 */
    private openNote() {
        this.trash?.destroy();
        EventBus.emit(GAME_EVT.OPEN_NOTE);

        const noteIndex = Phaser.Math.Between(1, 6);
        this.note = this.scene.add
            .image(
                this.scene.scale.width / 2,
                this.scene.scale.height / 2,
                `note_${noteIndex}`
            )
            .setDepth(200)
            .setInteractive({ useHandCursor: true });

        // 쪽지 클릭하면 닫기
        this.note.on("pointerdown", () => {
            this.note?.destroy();
            EventBus.emit(GAME_EVT.CLOSE_NOTE);
        });
    }

    destroy() {
        this.trash?.destroy();
        this.note?.destroy();
    }
}
