// ──────────────────────────────────────────────────
// # Phaser 게임 인스턴스를 React에 마운트하는 브릿지
// ──────────────────────────────────────────────────

import { useLayoutEffect, useRef, useEffect } from "react";
import { EventBus } from "./events/EventBus";
import { GAME_EVT } from "./events/GameEvt";
import StartGame from "./game/main";
import { useGameStore } from "./stores/useGameStore";

export const PhaserGame = () => {
    const game = useRef<Phaser.Game | null>(null);

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame("game-container");
        }

        return () => {
            game.current?.destroy(true);
            game.current = null;
        };
    }, []);

    const setPaused = useGameStore((s) => s.setPaused);

    // ESC 키 입력 시 게임 일시정지 & 재개
    useEffect(() => {
        EventBus.on(GAME_EVT.PAUSE, () => setPaused(true));
        EventBus.on(GAME_EVT.RESUMED, () => setPaused(false));

        return () => {
            EventBus.off(GAME_EVT.PAUSE);
            EventBus.off(GAME_EVT.RESUMED);
        };
    }, []);

    return <div id="game-container" />;
};
