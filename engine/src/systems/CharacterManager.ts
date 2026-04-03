// ──────────────────────────────────────────────────
// # 캐릭터 스폰 / 동작 관리
// ──────────────────────────────────────────────────

import { SpineX } from "../core/SpineX";

export type CharacterConfig = {
    key: string;
    x: number;
    y: number;
    anim: string;
    skin: string;
    scale?: number;
    depth?: number;
    enterFrom?: "left" | "right" | "back" | number;
    exitTo?: "left" | "right" | "back" | number;
    duration?: number;
    enterSfx?: string;
    exitSfx?: string;
};

export class CharacterManager {
    private scene: Phaser.Scene;
    private characters: Map<string, { spine: SpineX; config: CharacterConfig }> =
        new Map();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /** 캐릭터 등장 */
    enter(id: string, config: CharacterConfig): Promise<void> {
        return new Promise((resolve) => {

            let startX: number;
            if(config.enterFrom === 'left') startX = -2000;
                else if (config.enterFrom === 'right') startX = 2000;
                else startX = 1000

            const spine = this.scene.add.spine(
                startX,
                config.y,
                `${config.key}_data`,
                `${config.key}_atlas`
            );

            if (config.scale) spine.setScale(config.scale);
            if (config.depth !== undefined) spine.setDepth(config.depth);

            const spineX = new SpineX(spine);
            spineX.setAllMix();
            spineX.setAnim(config.anim);
            spineX.setSkin(config.skin)

            this.characters.set(id, { spine: spineX, config });

            this.scene.tweens.add({
                targets: spine,
                x: config.x,
                duration: config.duration,
                onComplete: () => {
                    spineX.setAnim('idle_1');
                    resolve()},
            });
        });
    }

    /** 캐릭터 퇴장 */
    exit(id: string): Promise<void> {
        return new Promise((resolve) => {
            const entry = this.characters.get(id);
            if (!entry) return resolve();

            const { spine, config } = entry;
            const raw = spine.raw;
            const W = this.scene.scale.width;

            let targetX: number;
            if (config.exitTo === "left") {targetX = -1000;
                spine.walkLeft();
            }
            else if (config.exitTo === "right") targetX = W + 1000;
            else if (typeof config.exitTo === "number") targetX = config.exitTo;
            else targetX = raw.x + 400;

            this.scene.tweens.add({
                targets: raw,
                x: targetX,
                duration: 2500,
                ease: "Sine.easeIn",
                onComplete: () => {
                    raw.destroy();
                    this.characters.delete(id);
                    resolve();
                },
            });
        });
    }

    /** 애니메이션 변경 */
    setAnim(id: string, anim: string, loop: boolean = true) {
        this.characters.get(id)?.spine.setAnim(anim, loop);
    }

    /** 스킨 변경 */
    setSkin(id: string, skin: string) {
        this.characters.get(id)?.spine.setSkin(skin);
    }

    /** 말하는 입 스킨 적용 */
    talk(id: string) {
        this.characters.get(id)?.spine.talk();
    }

    /** 닫힌 입 스킨 적용 */
    still(id: string) {
        this.characters.get(id)?.spine.still();
    }

    has(id: string): boolean {
        return this.characters.has(id);
    }

    destroyAll() {
        this.characters.forEach(({ spine }) => spine.raw.destroy());
        this.characters.clear();
    }
}
