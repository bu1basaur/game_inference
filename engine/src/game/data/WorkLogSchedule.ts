// ──────────────────────────────────────────────────
// # 근무일지 이벤트별 사전 정의 내용
// ──────────────────────────────────────────────────

export type WorkLogSchedule = {
    eventKey: string;
    content: string; // 이벤트 확정 시 표시될 내용
};

export const WORKLOG_SCHEDULE: WorkLogSchedule[] = [
    { eventKey: "shop_open", content: "가게 오픈" },
    { eventKey: "homeless_visit_first", content: "노숙자 방문" },

    // 추후 추가
];
