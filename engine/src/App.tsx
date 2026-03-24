import { EventBus } from "./events/EventBus";
import { GAME_EVT } from "./events/GameEvt";
import { PhaserGame } from "./PhaserGame";
import { useGameStore } from "./stores/useGameStore";
import OverlayConnector from "./ui/OverlayConnector";
import OverlayManager from "./ui/overlays/OverlayManager";

function App() {
    const isPaused = useGameStore((s) => s.isPaused);

    const handleResume = () => {
        EventBus.emit(GAME_EVT.RESUME);
    };

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
                    <button className="pause-resume-btn" onClick={handleResume}>
                        게임으로 돌아가기
                    </button>
                    <button className="pause-exit-btn" onClick={handleExit}>
                        나가기
                    </button>
                </div>
            )}

            <OverlayConnector />
            <OverlayManager />
        </div>
    );
}

export default App;
