import { useEffect } from "react";
import { EventBus } from "../events/EventBus";
import { useOverlayStore } from "../stores/useOverlayStore";

const OverlayConnector = () => {
    const openOverlay = useOverlayStore((s) => s.openOverlay);

    useEffect(() => {
        const openCalculator = () => openOverlay("calculator");
        const openBoard = () => openOverlay("board");
        const openInventory = () => openOverlay("inventory");

        EventBus.on("OPEN_CALCULATOR", openCalculator);
        EventBus.on("OPEN_BOARD", openBoard);
        EventBus.on("OPEN_INVENTORY", openInventory);
        EventBus.on("OPEN_RECEIPT", () => openOverlay("receipt"));

        return () => {
            EventBus.off("OPEN_CALCULATOR", openCalculator);
            EventBus.off("OPEN_BOARD", openBoard);
            EventBus.off("OPEN_INVENTORY", openInventory);
        };
    }, []);

    return null;
};

export default OverlayConnector;
