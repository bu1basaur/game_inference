import { EventBus } from "./events/EventBus";
import { GAME_EVT } from "./events/GameEvt";
import { PhaserGame } from "./PhaserGame";
import { useGameStore } from "./stores/useGameStore";

function App() {
    const isPaused = useGameStore((s) => s.isPaused);

    const handleResume = () => {
        EventBus.emit(GAME_EVT.RESUME);
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
                </div>
            )}
        </div>
    );
}

export default App;
