import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const items = ["열쇠", "메모", "사진", "메롱"];

const InventoryOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (index: number) => {
        const next = selected === index ? null : index;
        setSelected(next);
        if (next !== null) {
            console.log(`[인벤토리] 선택: ${items[next]}`);
        }
    };

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.POPUP_CLOSE);
    };

    const handleConfirm = () => {
        if (selected !== null) {
            console.log(`[인벤토리] 확인 - index: ${selected}, item: ${items[selected]}`);
            EventBus.emit(GAME_EVT.INVENTORY_CONFIRM, {
                index: selected,
                item: items[selected],
            });
        }
        handleClose();
    };

    return (
        <div className="overlay-backdrop">
            <div
                className="relative"
                style={{
                    width: "min(100vw, 177.78vh)",
                    height: "min(56.25vw, 100vh)",
                    position: "relative",
                }}
            >
                <img
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                    src="/assets/game/images/inventory/bg.png"
                    alt=""
                    draggable={false}
                />

                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "5%",
                        width: "55%",
                        gap: "1%",
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`inventory-item${
                                selected === i ? " selected" : ""
                            }`}
                            style={{ fontSize: "1.2vw" }}
                            onClick={() => handleSelect(i)}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                <button
                    className="inventory-confirm-btn"
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "8%",
                        padding: "1% 2.5%",
                        fontSize: "1.2vw",
                        background: "#ffcc00",
                        color: "black",
                        border: "2px solid black",
                        cursor: "pointer",
                    }}
                    onClick={handleConfirm}
                    disabled={selected === null}
                >
                    확인
                </button>

                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "20%",
                        padding: "1% 2.5%",
                        fontSize: "1.2vw",
                        background: "#ffcc00",
                        color: "black",
                        border: "2px solid black",
                        cursor: "pointer",
                        userSelect: "none",
                        textAlign: "center",
                    }}
                    onClick={handleClose}
                >
                    닫기
                </div>
            </div>
        </div>
    );
};

export default InventoryOverlay;

