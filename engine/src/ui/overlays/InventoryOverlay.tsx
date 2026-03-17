import { useOverlayStore } from "../../stores/useOverlayStore";
import "../styles/overlay.css";

const items = ["열쇠", "메모", "사진", "메롱"];

const InventoryOverlay = () => {
    const { closeOverlay } = useOverlayStore();

    return (
        <div className="overlay-bg">
            <div className="overlay-box">
                <div className="overlay-title">Inventory</div>

                <div className="inventory-grid">
                    {items.map((item, i) => (
                        <div key={i} className="inventory-slot">
                            {item}
                        </div>
                    ))}
                </div>

                <div className="close-btn" onClick={closeOverlay}>
                    닫기
                </div>
            </div>
        </div>
    );
};

export default InventoryOverlay;
