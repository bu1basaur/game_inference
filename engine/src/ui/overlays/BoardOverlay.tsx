import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useNoteStore, SavedNote } from "../../stores/useNoteStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";
import "../../ui/styles/overlay.css";

const BoardOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const handleClose = () => { closeOverlay(); EventBus.emit(GAME_EVT.POPUP_CLOSE); };
    const notes = useNoteStore((s) => s.notes);
    const [zoomed, setZoomed] = useState<SavedNote | null>(null);

    return (
        <div className="overlay-backdrop">
            <div className="overlay-panel" style={{ width: 600 }}>
                <div className="overlay-title">Board</div>

                {notes.length === 0 ? (
                    <div className="board-empty"></div>
                ) : (
                    <div className="board-grid">
                        {notes.map((note) => (
                            <img
                                key={note.id}
                                className="board-note"
                                src={`/assets/game/images/${note.imageKey}.png`}
                                alt={note.imageKey}
                                onClick={() => setZoomed(note)}
                            />
                        ))}
                    </div>
                )}

                <div className="overlay-close-btn" onClick={handleClose}>닫기</div>
            </div>

            {zoomed && (
                <div className="board-zoom-backdrop" onClick={() => setZoomed(null)}>
                    <img
                        className="board-zoom-img"
                        src={`/assets/game/images/${zoomed.imageKey}.png`}
                        alt={zoomed.imageKey}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default BoardOverlay;
