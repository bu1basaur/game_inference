import { CharacterConfig } from "../../systems/CharacterManager";

export const CHARACTERS: Record<string, CharacterConfig> = {
    homeless: {
        key: "nyangi", // 나중에 키값변경
        atlasKey: "nyangi-atlas",
        x: 0,
        y: 0,
        anim: "idle_1",
        scale: 1,
        depth: -1,
        enterFrom: "right",
        exitTo: "right",
        // enterSfx: "sfx_walk",
        // exitSfx: "sfx_walk",
    },

    // 이후 추가
};
