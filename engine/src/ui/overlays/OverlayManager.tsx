import { useOverlayStore } from "../../stores/useOverlayStore";
import BoardOverlay from "./BoardOverlay";
import InventoryOverlay from "./InventoryOverlay";
import CalculatorOverlay from "./CalculatorOverlay";
import ReceiptOverlay from "./ReceiptOverlay";

const OverlayManager = () => {
    const { overlay } = useOverlayStore();

    return (
        <>
            {overlay === "board" && <BoardOverlay />}
            {overlay === "inventory" && <InventoryOverlay />}
            {overlay === "calculator" && <CalculatorOverlay />}
            {overlay === "receipt" && <ReceiptOverlay />}
        </>
    );
};

export default OverlayManager;
