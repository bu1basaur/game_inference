// ──────────────────────────────────────────────────
// # 캐릭터 정의 데이터
// ──────────────────────────────────────────────────

import { CharacterConfig } from "../../systems/CharacterManager";

export const CHARACTERS: Record<string, CharacterConfig> = {
    homeless: {
        key: "nyangi",
        x: -200,
        y: 50,
        anim: "idle_1",
        skin: "default",
        scale: 1,
        depth: -1,
        enterFrom: "right",
        exitTo: "right",
        duration: 3000,
        // enterSfx: "sfx_walk",
        // exitSfx: "sfx_walk",
    },

    yogurt_lady: {
        key: "ch_1",
        x:900,
        y: 1130,
        anim: "idle_6",
        skin:"mouth_still",
        scale: 0.55,
        depth: -1,
        enterFrom: "right",
        exitTo: "left",
        duration: 2500,
    },

    // 이후 추가
};
