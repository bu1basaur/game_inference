import { Game } from "./../game/scenes/Game";
import { TimelineManager } from "./TimelineManager";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";

export function registerListeners(
    game: Game,
    timelineManager: TimelineManager
) {
    EventBus.on(
        GAME_EVT.TIMELINE,
        (key: string) => game.onTimelineEvent(key),
        game
    );
    EventBus.on(GAME_EVT.RESUME, () => game.resumeGame(), game);
    EventBus.on(GAME_EVT.DIALOGUE_WAITING, () => timelineManager.pause(), game);
    EventBus.on(
        GAME_EVT.DIALOGUE_RESUME,
        () => timelineManager.slowDown(),
        game
    );
}

export function unregisterListeners(game: Game) {
    EventBus.off(GAME_EVT.TIMELINE, undefined, game);
    EventBus.off(GAME_EVT.RESUME, undefined, game);
    EventBus.off(GAME_EVT.DIALOGUE_WAITING, undefined, game);
    EventBus.off(GAME_EVT.DIALOGUE_RESUME, undefined, game);
}
