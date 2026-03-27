import { useOverlayStore } from "../../stores/useOverlayStore";
import BoardOverlay from "./BoardOverlay";
import InventoryOverlay from "./InventoryOverlay";
import CalculatorOverlay from "./CalculatorOverlay";
import ReceiptOverlay from "./ReceiptOverlay";
import NoteOverlay from "./NoteOverlay";
import LoadOverlay from "./LoadOverlay";
import NotebookOverlay from "./NotebookOverlay";
import WorkLogOverlay from "./WorkLogOverlay";

const OverlayManager = () => {
    const { overlay } = useOverlayStore();

    return (
        <>
            {overlay === "board" && <BoardOverlay />}
            {overlay === "inventory" && <InventoryOverlay />}
            {overlay === "calculator" && <CalculatorOverlay />}
            {overlay === "receipt" && <ReceiptOverlay />}
            {overlay === "note" && <NoteOverlay />}
            {overlay === "load" && <LoadOverlay />}
            {overlay === "notebook" && <NotebookOverlay />}
            {overlay === "worklog" && <WorkLogOverlay />}
        </>
    );
};

export default OverlayManager;
