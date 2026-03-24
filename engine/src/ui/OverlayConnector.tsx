import { useEffect } from "react";
import { EventBus } from "../events/EventBus";
import { useOverlayStore, OverlayData } from "../stores/useOverlayStore";
import { useNoteStore } from "../stores/useNoteStore";
import { GAME_EVT } from "../events/GameEvt";

const OverlayConnector = () => {
    const openOverlay = useOverlayStore((s) => s.openOverlay);
    const addNote = useNoteStore((s) => s.addNote);

    useEffect(() => {
        const openCalculator = () => openOverlay("calculator");
        const openBoard = () => openOverlay("board");
        const openInventory = () => openOverlay("inventory");

        EventBus.on("OPEN_CALCULATOR", openCalculator);
        EventBus.on("OPEN_BOARD", openBoard);
        EventBus.on("OPEN_INVENTORY", openInventory);
        EventBus.on("OPEN_RECEIPT", () => openOverlay("receipt"));
        EventBus.on(GAME_EVT.NOTE_OPEN, ({ imageKey }: OverlayData) => {
            // 쪽지 열기
            openOverlay("note", { imageKey });
            // 게시판 저장용
            addNote({
                imageKey: imageKey!,
            });
        });

        return () => {
            EventBus.off("OPEN_CALCULATOR", openCalculator);
            EventBus.off("OPEN_BOARD", openBoard);
            EventBus.off("OPEN_INVENTORY", openInventory);
            EventBus.off(GAME_EVT.NOTE_OPEN);
        };
    }, []);

    return null;
};

export default OverlayConnector;
