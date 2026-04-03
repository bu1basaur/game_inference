// ──────────────────────────────────────────────────
// # 근무일지 이벤트별 사전 정의 내용
// ──────────────────────────────────────────────────

export type WorkLogSchedule = {
    eventKey: string;
    content: string; // 이벤트 확정 시 표시될 내용
};

export const WORKLOG_SCHEDULE: WorkLogSchedule[] = [
    { eventKey: "shop_open", content: "영업 시작! 새똥이 많다." },
    { eventKey: "homeless_visit_first", content: "노숙자 방문. 요즘 자주 보이네." },
    { eventKey: "radio_news_first", content: "가위 살인범에 대한 이야기 들었다. 무시무시하다." },
    { eventKey: "yogurt_visit_first", content: "요구르트 판매원 방문했다. 귀가 아픈 것 같기도." },
    

    // 추후 추가
];
