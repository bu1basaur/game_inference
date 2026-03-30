// ──────────────────────────────────────────────────
// # 영수증
// ──────────────────────────────────────────────────

import { useOverlayStore } from "../../stores/useOverlayStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const ReceiptOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.POPUP_CLOSE);
    };

    return (
        <div className="overlay-backdrop">
            <div className="overlay-panel" style={{ width: 600 }}>
                <div className="overlay-title">영수증</div>

                <div
                    style={{
                        width: "100%",
                        height: 200,
                        border: "2px solid white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    영수증 이미지 자리
                </div>

                <div className="overlay-close-btn" onClick={handleClose}>
                    닫기
                </div>
            </div>
        </div>
    );
};

export default ReceiptOverlay;
