// ──────────────────────────────────────────────────
// # 현재 오버레이 상태 보고 해당 컴포넌트 렌더
// ──────────────────────────────────────────────────

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
