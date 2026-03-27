import { useOverlayStore } from "../../stores/useOverlayStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const NoteOverlay = () => {
    const { closeOverlay, overlayData } = useOverlayStore();

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.POPUP_CLOSE);
    };

    return (
        <div className="overlay-backdrop">
            <img
                className="note-img"
                src={`/assets/game/images/${overlayData?.imageKey}.png`}
                onClick={handleClose}
            />
        </div>
    );
};

export default NoteOverlay;
