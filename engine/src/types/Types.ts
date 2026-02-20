export type GameData = {
    characters: CharacterData[];
    events: EventData[];
    dialogues: DialogueData;
    gameConfig: GameConfig;
};

export type CharacterData = {
    id: string;
    name: string;
    spineKey: string; // Spine 애니메이션 키
    defaultMood: string;
    visitPattern?: {
        minVisits: number;
        maxVisits: number;
        preferredTimes?: number[]; // 선호 방문 시간대 (hour)
    };
};

export type EventData = {
    id: string;
    type: "visit" | "story" | "special";
    triggerId: string; // 이벤트 트리거 식별자
    conditions?: EventCondition[];
    time?: number; // 게임 내 시간 (분 단위: 0~1440)
    characterId?: string;
    dialogueId: string;
    priority?: number; // 우선순위 (높을수록 먼저 실행)
    onComplete?: EventAction[]; // 이벤트 완료 후 액션
};

export type EventCondition = {
    type: "time" | "flag" | "visit_count" | "choice";
    key: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=";
    value: any;
};

export type EventAction = {
    type: "set_flag" | "unlock_event" | "add_item" | "trigger_event";
    key: string;
    value?: any;
};

export type DialogueData = {
    [dialogueId: string]: Node;
};

export type DialogueNode = {
    id: string;
    speaker: "player" | "character" | "narrator";
    characterId?: string;
    text: string;
    mood?: string; // 캐릭터 표정/감정
    choices?: Choice[];
    next?: string | null; // 다음 다이얼로그 ID (null이면 종료)
    actions?: EventAction[]; // 이 대사 후 실행할 액션
    conditions?: EventCondition[]; // 이 노드 표시 조건
};

export type Choice = {
    text: string;
    next: string; // 다음 다이얼로그 ID
    conditions?: EventCondition[];
    actions?: EventAction[]; // 선택 시 실행할 액션
};

export type GameConfig = {
    dayDuration: number; // 하루 길이 (밀리초)
    startTime: number; // 시작 시간 (분)
    endTime: number; // 종료 시간 (분)
};
