// ──────────────────────────────────────────────────
// # 인벤토리 잘못 선택 시 캐릭터별 거절 대사
// 배열 순서대로 진행되며, 마지막 항목은 이후에도 반복 사용
// ──────────────────────────────────────────────────

export type RejectionEntry = {
    speaker: string;
    lines: string[];
};

export const INVENTORY_REJECTIONS: Record<string, RejectionEntry> = {
    homeless: {
        speaker: "노숙자",
        lines: [
            "이건 제가 말한 물건이 아니에요.",
            "저... 방석이요. 방석 말씀드렸는데요.",
            "방석이라고요. 방. 석.",
        ],
    },
    // 추후 캐릭터 추가 시 동일 구조
    // example: {
    //     speaker: "요구르트 판매원",
    //     lines: ["그게 아니라니까요.", "...제 말 듣고 계신 거 맞죠?"],
    // },
};
