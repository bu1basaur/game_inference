// ──────────────────────────────────────────────────
// # EventBus 이벤트 수신
// ──────────────────────────────────────────────────

import { Game } from "./../game/scenes/Game";
import { TimelineManager } from "./TimelineManager";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";
import { SaveManager } from "./SaveManager";

export function registerListeners(
    game: Game,
    timelineManager: TimelineManager
) {
    const saveManager = new SaveManager(game.storyManager, timelineManager);

    EventBus.on(
        GAME_EVT.SAVE,
        () => {
            saveManager
                .save()
                .then(() =>
                    EventBus.emit(GAME_EVT.SAVE_RESULT, { success: true })
                )
                .catch(() =>
                    EventBus.emit(GAME_EVT.SAVE_RESULT, { success: false })
                );
        },
        game
    );

    // 이벤트 키에 맞는 타임라인 이벤트 발생
    EventBus.on(
        GAME_EVT.TIMELINE,
        (key: string) => game.onTimelineEvent(key),
        game
    );

    // 조건 불충족으로 스킵된 이벤트 → 근무일지에 "?" 항목 추가
    EventBus.on(
        GAME_EVT.TIMELINE_SKIP,
        ({ eventKey, time }: { eventKey: string; time: string }) =>
            game.timelineHandler.handleSkip(eventKey, time),
        game
    );

    // 게임 재개 (ESC)
    EventBus.on(GAME_EVT.RESUME, () => game.resumeGame(), game);

    // 다이얼로그 노출 후 대기 시간(2초) 동안 시간 흐름 정지
    EventBus.on(GAME_EVT.WAIT_DIALOGUE, () => timelineManager.pause(), game);

    // 다이얼로그 나오고 있을 때는 시간 슬로우. 멈추면 작위적인 느낌? 너무 빠른 것도 X.
    EventBus.on(
        GAME_EVT.RESUME_DIALOGUE,
        () => timelineManager.slowDown(),
        game
    );

    // 메인 화면으로 나가기 (이벤트 중첩 방지로 모든 이벤트 제거)
    EventBus.on(
        GAME_EVT.GOTO_MAIN,
        () => {
            game.stopBgm();
            unregisterListeners(game);
            game.scene.start("MainMenu");
        },
        game
    );

    // 오버레이 팝업 여닫기
    EventBus.on(
        GAME_EVT.OPEN_POPUP,
        () => game.pauseControl.pauseForPopup(),
        game
    );
    EventBus.on(
        GAME_EVT.CLOSE_POPUP,
        () => game.pauseControl.resumeForPopup(),
        game
    );
}

export function unregisterListeners(game: Game) {
    EventBus.off(GAME_EVT.TIMELINE, undefined, game);
    EventBus.off(GAME_EVT.TIMELINE_SKIP, undefined, game);
    EventBus.off(GAME_EVT.RESUME, undefined, game);
    EventBus.off(GAME_EVT.WAIT_DIALOGUE, undefined, game);
    EventBus.off(GAME_EVT.RESUME_DIALOGUE, undefined, game);
    EventBus.off(GAME_EVT.OPEN_POPUP, undefined, game);
    EventBus.off(GAME_EVT.CLOSE_POPUP, undefined, game);
    EventBus.off(GAME_EVT.GOTO_MAIN, undefined, game);
    EventBus.off(GAME_EVT.SAVE, undefined, game);
}
