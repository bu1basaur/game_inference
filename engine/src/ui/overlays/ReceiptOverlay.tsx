import { useOverlayStore } from "../../stores/useOverlayStore";
import "../styles/overlay.css";

const ReceiptOverlay = () => {
    const { closeOverlay } = useOverlayStore();

    return (
        <div className="overlay-bg">
            <div className="overlay-box">
                <div className="overlay-title">영수증</div>

                <div className="evidence-view">
                    <div className="receipt-box">영수증 이미지 자리</div>
                </div>

                <div className="close-btn" onClick={closeOverlay}>
                    닫기
                </div>
            </div>
        </div>
    );
};

export default ReceiptOverlay;
