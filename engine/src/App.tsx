// ──────────────────────────────────────────────────
// # 루트 컴포넌트 (씬 감지, pause overlay, UI 조건부
// ──────────────────────────────────────────────────

import { useEffect } from "react";
import { EventBus } from "./events/EventBus";
import { GAME_EVT } from "./events/GameEvt";
import { PhaserGame } from "./PhaserGame";
import { useGameStore } from "./stores/useGameStore";
import OverlayConnector from "./ui/OverlayConnector";
import OverlayManager from "./ui/overlays/OverlayManager";
import LoginPanel from "./ui/LoginPanel";
import SaveButton from "./ui/SaveButton";

function App() {
    const isPaused = useGameStore((s) => s.isPaused);
    const currentScene = useGameStore((s) => s.currentScene);
    const setScene = useGameStore((s) => s.setScene);

    useEffect(() => {
        const onSceneReady = (scene: Phaser.Scene) => {
            setScene(scene.scene.key);
        };
        EventBus.on(GAME_EVT.SCENE_READY, onSceneReady);
        return () => {
            EventBus.off(GAME_EVT.SCENE_READY, onSceneReady);
        };
    }, []);

    const handleResume = () => EventBus.emit(GAME_EVT.RESUME);
    const handleExit = () => {
        EventBus.emit(GAME_EVT.RESUMED);
        EventBus.emit(GAME_EVT.GOTO_MAIN);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <PhaserGame />

            {isPaused && (
                <div className="pause-overlay">
                    <span className="pause-title">PAUSED</span>
                    <button className="pause-btn" onClick={handleResume}>
                        게임으로 돌아가기
                    </button>
                    <button className="pause-btn exit" onClick={handleExit}>
                        나가기
                    </button>
                </div>
            )}

            {currentScene === "MainMenu" && <LoginPanel />}
            {currentScene === "Game" && <SaveButton />}

            <OverlayConnector />
            <OverlayManager />
        </div>
    );
}

export default App;
