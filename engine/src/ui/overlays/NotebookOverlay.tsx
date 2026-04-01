// ──────────────────────────────────────────────────
// # 수첩 (용의자 6명 & 주민 상세)
// ──────────────────────────────────────────────────

import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { SUSPECTS, Suspect } from "../../game/data/Suspects";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const NotebookOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const [selected, setSelected] = useState<Suspect>(SUSPECTS[0]);

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.CLOSE_POPUP);
    };

    return (
        <div className="overlay-backdrop">
            <div className="overlay-panel-dark notebook-container">
                <div className="notebook-sidebar">
                    <div className="notebook-sidebar-header">용의자 목록</div>
                    {SUSPECTS.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => setSelected(s)}
                            className={`notebook-sidebar-item${
                                selected.id === s.id ? " active" : ""
                            }`}
                        >
                            {s.name}
                        </div>
                    ))}
                </div>

                <div className="notebook-detail">
                    <div className="notebook-name">{selected.name}</div>

                    <div className="notebook-portrait">
                        {selected.imageKey ? (
                            <img
                                src={`/assets/game/images/${selected.imageKey}.png`}
                            />
                        ) : (
                            "사진 없음"
                        )}
                    </div>

                    <div className="notebook-info">
                        <div className="notebook-info-row">
                            <span className="notebook-info-label">나이</span>
                            <span>{selected.age}세</span>
                        </div>
                        <div className="notebook-info-row">
                            <span className="notebook-info-label">직업</span>
                            <span>{selected.job}</span>
                        </div>
                        <div
                            className="notebook-info-row"
                            style={{ marginTop: 8 }}
                        >
                            <span className="notebook-info-label">비고</span>
                            <span className="notebook-info-desc">
                                {selected.description}
                            </span>
                        </div>
                    </div>

                    <div
                        className="overlay-btn"
                        style={{ marginTop: "auto", alignSelf: "flex-start" }}
                        onClick={handleClose}
                    >
                        닫기
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotebookOverlay;
