// ──────────────────────────────────────────────────
// # 루트 컴포넌트 (씬 감지, pause overlay, UI 조건부
// ──────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { EventBus } from "./events/EventBus";
import { GAME_EVT } from "./events/GameEvt";
import { useOverlayStore } from "./stores/useOverlayStore";
import { PhaserGame } from "./PhaserGame";
import { useGameStore } from "./stores/useGameStore";
import OverlayConnector from "./ui/OverlayConnector";
import OverlayManager from "./ui/overlays/OverlayManager";
import LoginPanel from "./ui/LoginPanel";
import SaveButton from "./ui/SaveButton";
import DebugPanel from "./ui/DebugPanel";

function App() {
    const isPaused = useGameStore((s) => s.isPaused);
    const currentScene = useGameStore((s) => s.currentScene);
    const setScene = useGameStore((s) => s.setScene);
    const [exitModal, setExitModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onSceneReady = (scene: Phaser.Scene) => {
            setScene(scene.scene.key);
        };
        EventBus.on(GAME_EVT.READY_SCENE, onSceneReady);
        return () => {
            EventBus.off(GAME_EVT.READY_SCENE, onSceneReady);
        };
    }, []);

    const openOverlay = useOverlayStore((s) => s.openOverlay);

    const handleResume = () => EventBus.emit(GAME_EVT.RESUME);
    const handleOptions = () => openOverlay("options");

    const goToMain = () => {
        setExitModal(false);
        EventBus.emit(GAME_EVT.RESUMED);
        EventBus.emit(GAME_EVT.GOTO_MAIN);
    };

    const handleSaveAndExit = () => {
        if (saving) return;
        setSaving(true);
        EventBus.once(
            GAME_EVT.SAVE_RESULT,
            ({ success }: { success: boolean }) => {
                setSaving(false);
                if (success) goToMain();
            }
        );
        EventBus.emit(GAME_EVT.SAVE);
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
                    <button className="pause-btn" onClick={handleOptions}>
                        옵션
                    </button>
                    <button
                        className="pause-btn exit"
                        onClick={() => setExitModal(true)}
                    >
                        나가기
                    </button>
                </div>
            )}

            {exitModal && (
                <div className="exit-modal-backdrop">
                    <div className="exit-modal">
                        <p className="exit-modal-title">나가시겠습니까?</p>
                        <div className="exit-modal-btns">
                            <button
                                className="exit-modal-btn"
                                onClick={handleSaveAndExit}
                                disabled={saving}
                            >
                                {saving ? "저장 중..." : "저장하고 나가기"}
                            </button>
                            <button
                                className="exit-modal-btn exit"
                                onClick={goToMain}
                            >
                                그냥 나가기
                            </button>
                            <button
                                className="exit-modal-btn"
                                onClick={() => setExitModal(false)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {currentScene === "MainMenu" && <LoginPanel />}
            {currentScene === "Game" && <SaveButton />}
            {import.meta.env.DEV && currentScene === "Game" && <DebugPanel />}

            <OverlayConnector />
            <OverlayManager />
        </div>
    );
}

export default App;

