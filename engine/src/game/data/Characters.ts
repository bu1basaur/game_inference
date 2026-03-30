// ──────────────────────────────────────────────────
// # 캐릭터 정의 데이터
// ──────────────────────────────────────────────────

import { CharacterConfig } from "../../systems/CharacterManager";

export const CHARACTERS: Record<string, CharacterConfig> = {
    homeless: {
        key: "nyangi", // 나중에 키값변경
        // atlasKey: "nyangi",
        x: -300,
        y: 100,
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
