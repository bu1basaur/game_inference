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

    // 게임 재개 (ESC)
    EventBus.on(GAME_EVT.RESUME, () => game.resumeGame(), game);

    // 다이얼로그 노출 후 대기 시간(2초) 동안 시간 흐름 정지
    EventBus.on(GAME_EVT.DIALOGUE_WAITING, () => timelineManager.pause(), game);

    // 다이얼로그 나오고 있을 때는 시간 슬로우. 멈추면 작위적인 느낌? 너무 빠른 것도 X.
    EventBus.on(
        GAME_EVT.DIALOGUE_RESUME,
        () => timelineManager.slowDown(),
        game
    );

    // 메인 화면으로 나가기 (이벤트 중첩 방지로 모든 이벤트 제거)
    EventBus.on(
        GAME_EVT.GOTO_MAIN,
        () => {
            unregisterListeners(game);
            game.scene.start("MainMenu");
        },
        game
    );

    // 오버레이 팝업 여닫기
    EventBus.on(
        GAME_EVT.POPUP_OPEN,
        () => game.pauseControl.pauseForPopup(),
        game
    );
    EventBus.on(
        GAME_EVT.POPUP_CLOSE,
        () => game.pauseControl.resumeForPopup(),
        game
    );
}

export function unregisterListeners(game: Game) {
    EventBus.off(GAME_EVT.TIMELINE, undefined, game);
    EventBus.off(GAME_EVT.RESUME, undefined, game);
    EventBus.off(GAME_EVT.DIALOGUE_WAITING, undefined, game);
    EventBus.off(GAME_EVT.DIALOGUE_RESUME, undefined, game);
    EventBus.off(GAME_EVT.POPUP_OPEN, undefined, game);
    EventBus.off(GAME_EVT.POPUP_CLOSE, undefined, game);
    EventBus.off(GAME_EVT.GOTO_MAIN, undefined, game);
    EventBus.off(GAME_EVT.SAVE, undefined, game);
}
