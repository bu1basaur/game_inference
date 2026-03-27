import { useEffect } from "react";
import { EventBus } from "../events/EventBus";
import { useOverlayStore, OverlayData } from "../stores/useOverlayStore";
import { useNoteStore } from "../stores/useNoteStore";
import { useWorkLogStore } from "../stores/useWorkLogStore";
import { GAME_EVT } from "../events/GameEvt";

const OverlayConnector = () => {
    const openOverlay = useOverlayStore((s) => s.openOverlay);
    const addNote = useNoteStore((s) => s.addNote);
    const addWorkLogEntry = useWorkLogStore((s) => s.addEntry);

    useEffect(() => {
        const openCalculator = () => openOverlay("calculator");
        const openBoard = () => openOverlay("board");
        const openInventory = () => openOverlay("inventory");
        const openLoad = () => openOverlay("load");
        const openNotebook = () => openOverlay("notebook");
        const openWorklog = () => openOverlay("worklog");
        const handleWorkLogAdd = ({
            time,
            content,
        }: {
            time: string;
            content: string;
        }) => {
            addWorkLogEntry(time, content);
        };

        EventBus.on("OPEN_CALCULATOR", openCalculator);
        EventBus.on("OPEN_BOARD", openBoard);
        EventBus.on("OPEN_INVENTORY", openInventory);
        EventBus.on("OPEN_RECEIPT", () => openOverlay("receipt"));
        EventBus.on(GAME_EVT.OPEN_LOAD_OVERLAY, openLoad);
        EventBus.on(GAME_EVT.OPEN_NOTEBOOK, openNotebook);
        EventBus.on(GAME_EVT.OPEN_WORKLOG, openWorklog);
        EventBus.on(GAME_EVT.WORKLOG_ADD, handleWorkLogAdd);
        EventBus.on(GAME_EVT.NOTE_OPEN, ({ imageKey }: OverlayData) => {
            openOverlay("note", { imageKey });
            addNote({ imageKey: imageKey! });
        });

        return () => {
            EventBus.off("OPEN_CALCULATOR", openCalculator);
            EventBus.off("OPEN_BOARD", openBoard);
            EventBus.off("OPEN_INVENTORY", openInventory);
            EventBus.off(GAME_EVT.OPEN_LOAD_OVERLAY, openLoad);
            EventBus.off(GAME_EVT.OPEN_NOTEBOOK, openNotebook);
            EventBus.off(GAME_EVT.OPEN_WORKLOG, openWorklog);
            EventBus.off(GAME_EVT.WORKLOG_ADD, handleWorkLogAdd);
            EventBus.off(GAME_EVT.NOTE_OPEN);
        };
    }, []);

    return null;
};

export default OverlayConnector;

