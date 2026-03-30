// ──────────────────────────────────────────────────
// # 게임 이벤트 처리 로직
// ──────────────────────────────────────────────────

import { CHARACTERS } from "../game/data/Characters";
import { Trash } from "../game/objects/Trash";
import { CharacterManager } from "./CharacterManager";
import { DialogueManager } from "./DialogueManager";

export class GameEventHandler {
    constructor(
        private scene: Phaser.Scene,
        private characterManager: CharacterManager,
        private dialogueManager: DialogueManager
    ) {}

    async handle(event: string): Promise<void> {
        const [type, ...args] = event.split(":");

        switch (type) {
            case "char_enter": {
                const [id] = args;
                const config = CHARACTERS[id];
                if (config) await this.characterManager.enter(id, config);
                break;
            }
            case "char_exit": {
                const [id] = args;
                this.dialogueManager.setVisible(false);
                if (id === "homeless") {
                    const trash = new Trash(this.scene);
                    trash.show(700, 650);
                }
                await this.characterManager.exit(id);
                break;
            }
            case "char_anim": {
                const [id, anim, loopStr] = args;
                this.characterManager.setAnim(id, anim, loopStr !== "false");
                break;
            }
            case "sfx_bell":
                console.log("효과음: 벨");
                break;
            case "sfx_radio":
                console.log("효과음: 라디오");
                break;
            case "bg_change":
                console.log("배경 전환");
                break;
            default:
                console.warn("알 수 없는 이벤트:", event);
        }
    }

    async handleAll(events: string[]): Promise<void> {
        for (const evt of events) {
            await this.handle(evt);
        }
    }
}
