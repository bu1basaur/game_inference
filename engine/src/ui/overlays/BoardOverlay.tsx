import { useOverlayStore } from "../../stores/useOverlayStore";
import "../styles/overlay.css";

const BoardOverlay = () => {
    const { closeOverlay } = useOverlayStore();

    return (
        <div className="overlay-bg">
            <div className="overlay-box">
                <div className="overlay-title">게시판</div>

                <div className="close-btn" onClick={closeOverlay}>
                    닫기
                </div>
            </div>
        </div>
    );
};

export default BoardOverlay;
