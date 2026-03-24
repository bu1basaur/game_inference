import { useOverlayStore } from "../../stores/useOverlayStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";
import "../styles/overlay.css";

const NoteOverlay = () => {
    const { closeOverlay, overlayData } = useOverlayStore();
    console.log(overlayData?.imageKey);

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.POPUP_CLOSE);
    };

    return (
        <div className="overlay-bg">
            <img
                className="note-display"
                src={`/assets/game/images/${overlayData?.imageKey}.png`}
                onClick={handleClose}
            />
        </div>
    );
};

export default NoteOverlay;
