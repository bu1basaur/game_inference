// ──────────────────────────────────────────────────
// # 게임 이벤트 처리 로직
// ──────────────────────────────────────────────────

import { CHARACTERS } from "../game/data/Characters";
import { Trash } from "../game/objects/Trash";
import { CharacterManager } from "./CharacterManager";
import { DialogueManager } from "./DialogueManager";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";
import { INVENTORY_REJECTIONS } from "../game/data/InventoryRejections";
import { useWorkLogStore } from "../stores/useWorkLogStore";

export class GameEventHandler {
    constructor(
        private scene: Phaser.Scene,
        private characterManager: CharacterManager,
        private dialogueManager: DialogueManager,
        private getTime: () => string = () => ""
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
                    trash.show(700, 690);
                }
                await this.characterManager.exit(id);
                break;
            }
            case "char_anim": {
                const [id, anim, loopStr] = args;
                this.characterManager.setAnim(id, anim, loopStr !== "false");
                break;
            }
            case "char_talk": {
                const [id] = args;
                this.characterManager.talk(id);
                break;
            }
            case "char_still": {
                const [id] = args;
                this.characterManager.still(id);
                break;
            }
            case "open_inventory": {
                // 태그 형식: "open_inventory:아이템A:캐릭터ID"
                // 예) "open_inventory:방석:homeless"
                // 복수 아이템: "open_inventory:방석:열쇠:homeless"
                //   → 마지막 arg가 캐릭터ID, 나머지가 requiredItems
                //   → requiredItems가 비어있으면 아무 아이템이나 허용
                const speakerKey = args[args.length - 1];
                const requiredItems = args.slice(0, -1);
                const rejection = INVENTORY_REJECTIONS[speakerKey]?.[requiredItems[0] ?? ""];
                const extraRejection = INVENTORY_REJECTIONS[speakerKey]?.["_extra"];

                return new Promise<void>((resolve) => {
                    let rejectCount = 0;
                    let extraRejectCount = 0;

                    const tryOpen = () => {
                        let confirmedItems: string[] = [];

                        const onConfirm = (payload: {
                            item?: string;
                            items?: string[];
                        }) => {
                            confirmedItems =
                                payload.items ??
                                (payload.item ? [payload.item] : []);
                        };
                        EventBus.once(GAME_EVT.CONFIRM_INVENTORY, onConfirm);

                        // CLOSE_POPUP는 확인·닫기 모두에서 발생
                        // GameListeners의 resumeForPopup()이 먼저 실행된 후 이 핸들러가 실행됨
                        EventBus.once(GAME_EVT.CLOSE_POPUP, () => {
                            EventBus.off(
                                GAME_EVT.CONFIRM_INVENTORY,
                                onConfirm
                            );

                            // 확인 없이 닫기만 누른 경우 → 재오픈
                            if (confirmedItems.length === 0) {
                                tryOpen();
                                return;
                            }

                            const hasRequired =
                                requiredItems.length === 0 ||
                                confirmedItems.some((item) =>
                                    requiredItems.includes(item)
                                );
                            const hasExtras =
                                requiredItems.length > 0 &&
                                confirmedItems.some(
                                    (item) => !requiredItems.includes(item)
                                );

                            // 요청 아이템 포함 + 그 외 아이템 미포함 -> 정답
                            if (hasRequired && !hasExtras) {
                                resolve();
                                return;
                            }

                            // 요청 아이템은 있지만 다른 아이템도 함께 건넨 경우
                            if (hasRequired && hasExtras) {
                                const lines = extraRejection?.lines ?? ["다른 건 없어도 돼요."];
                                const text = lines[Math.min(extraRejectCount, lines.length - 1)];
                                const speaker = extraRejection?.speaker ?? speakerKey;
                                extraRejectCount++;
                                this.dialogueManager.show(
                                    { text, speaker, events: [], choices: [] },
                                    () => tryOpen()
                                );
                                return;
                            }

                            // 요청 아이템이 아예 없는 경우
                            const lines = rejection?.lines ?? ["이게 아니에요."];
                            const text =
                                lines[
                                    Math.min(rejectCount, lines.length - 1)
                                ];
                            const speaker =
                                rejection?.speaker ?? speakerKey;
                            rejectCount++;

                            this.dialogueManager.show(
                                {
                                    text,
                                    speaker,
                                    events: [],
                                    choices: [],
                                },
                                () => tryOpen()
                            );
                        });

                        EventBus.emit(GAME_EVT.OPEN_POPUP);
                        EventBus.emit("OPEN_INVENTORY");
                    };

                    tryOpen();
                });
            }
            case "worklog": {
                const content = args.join(":");
                useWorkLogStore.getState().addEntry(this.getTime(), content, "confirmed");
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
