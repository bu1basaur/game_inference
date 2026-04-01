// ──────────────────────────────────────────────────
// # 근무일지
// ──────────────────────────────────────────────────

import { useOverlayStore } from "../../stores/useOverlayStore";
import { useWorkLogStore } from "../../stores/useWorkLogStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const WorkLogOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const entries = useWorkLogStore((s) => s.entries);

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.CLOSE_POPUP);
    };

    return (
        <div className="overlay-backdrop">
            <div
                className="overlay-panel-dark"
                style={{ width: 580, display: "flex", flexDirection: "column" }}
            >
                <div className="worklog-header">근무일지</div>

                <div className="worklog-list">
                    {entries.length === 0 ? (
                        <div className="worklog-empty">
                            아직 기록이 없습니다.
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div key={entry.id} className="worklog-entry">
                                <span className="worklog-time">
                                    {entry.time}
                                </span>
                                <span className="worklog-content">
                                    {entry.content}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className="worklog-footer">
                    <div className="overlay-btn" onClick={handleClose}>
                        닫기
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkLogOverlay;
