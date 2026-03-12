export type CharacterConfig = {
    key: string;
    atlasKey: string;
    x: number;
    y: number;
    anim: string;
    skin?: string;
    scale?: number;
    depth?: number;
    enterFrom?: "left" | "right" | "back" | number;
    exitTo?: "left" | "right" | "back" | number;
    enterSfx?: string;
    exitSfx?: string;
};

export class CharacterManager {
    private scene: Phaser.Scene;
    private characters: Map<string, { spine: any; config: CharacterConfig }> =
        new Map();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /** 캐릭터 등장 */
    enter(id: string, config: CharacterConfig): Promise<void> {
        return new Promise((resolve) => {
            const W = this.scene.scale.width;

            let startX: number;
            if (config.enterFrom === "left") startX = -200;
            else if (config.enterFrom === "right") startX = W + 200;
            else if (typeof config.enterFrom === "number")
                startX = config.enterFrom;
            else startX = config.x + 400;

            const spine = this.scene.add.spine(
                startX,
                config.y,
                config.key,
                config.atlasKey
            );

            if (config.scale) spine.setScale(config.scale);
            if (config.depth !== undefined) spine.setDepth(config.depth);
            if (spine.animationState) {
                spine.animationState.setAnimation(0, config.anim, true);
            }

            this.characters.set(id, { spine, config });

            this.scene.tweens.add({
                targets: spine,
                x: config.x,
                duration: 1500,
                ease: "Sine.easeOut",
                onComplete: () => resolve(),
            });
        });
    }

    /** 캐릭터 퇴장 */
    exit(id: string): Promise<void> {
        return new Promise((resolve) => {
            const entry = this.characters.get(id);
            if (!entry) return resolve(); // entry 자체가 없는 경우 체크

            const { spine, config } = entry;
            const W = this.scene.scale.width;

            let targetX: number;
            if (config.exitTo === "left") targetX = -200;
            else if (config.exitTo === "right") targetX = W + 200;
            else if (typeof config.exitTo === "number") targetX = config.exitTo;
            else targetX = spine.x + 400;

            this.scene.tweens.add({
                targets: spine,
                x: targetX,
                duration: 1200,
                ease: "Sine.easeIn",
                onComplete: () => {
                    spine.destroy();
                    this.characters.delete(id);
                    resolve();
                },
            });
        });
    }

    /** 애니메이션 변경 */
    setAnim(id: string, anim: string, loop: boolean = true) {
        const entry = this.characters.get(id); // entry로 수정
        if (entry?.spine?.animationState) {
            entry.spine.animationState.setAnimation(0, anim, loop);
        }
    }

    has(id: string): boolean {
        return this.characters.has(id);
    }

    destroyAll() {
        this.characters.forEach(({ spine }) => spine.destroy());
        this.characters.clear();
    }
}
