import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const ITEMS: {
    id: number;
    name: string;
    description: string;
    imageKey: string | null;
}[] = [
    { id: 1, name: "방석", description: "낡고 오래된 방석.", imageKey: null },
    { id: 2, name: "메모", description: "누군가 남긴 메모지.", imageKey: null },
    {
        id: 3,
        name: "전화번호부",
        description: "전화번호부인듯",
        imageKey: null,
    },
    { id: 4, name: "메롱", description: "의미 불명의 물건.", imageKey: null },
    { id: 5, name: "열쇠", description: "작은 열쇠.", imageKey: null },
    { id: 6, name: "편지", description: "봉인된 편지.", imageKey: null },
    { id: 7, name: "시계", description: "멈춰버린 시계.", imageKey: null },
    { id: 8, name: "반지", description: "누군가의 반지.", imageKey: null },
    { id: 9, name: "노트", description: "빼곡히 채워진 노트.", imageKey: null },
    { id: 10, name: "꽃", description: "시든 꽃 한 송이.", imageKey: null },
    { id: 11, name: "약", description: "정체불명의 약.", imageKey: null },
    { id: 12, name: "지도", description: "낡은 지도 조각.", imageKey: null },
    { id: 13, name: "인형", description: "눈이 없는 인형.", imageKey: null },
    {
        id: 14,
        name: "테이프",
        description: "오래된 카세트 테이프.",
        imageKey: null,
    },
    { id: 15, name: "유리", description: "깨진 유리 조각.", imageKey: null },
    { id: 16, name: "신문", description: "오래된 신문.", imageKey: null },
    { id: 17, name: "담배", description: "다 피운 담배꽁초.", imageKey: null },
    { id: 18, name: "성냥", description: "성냥 한 개비.", imageKey: null },
    { id: 19, name: "실", description: "붉은 실 한 가닥.", imageKey: null },
    {
        id: 20,
        name: "돌",
        description: "강가에서 주운 돌멩이.",
        imageKey: null,
    },
    { id: 21, name: "책", description: "표지가 없는 책.", imageKey: null },
    { id: 22, name: "핀", description: "머리핀 하나.", imageKey: null },
    { id: 23, name: "병", description: "빈 유리병.", imageKey: null },
    {
        id: 24,
        name: "나침반",
        description: "바늘이 이상한 나침반.",
        imageKey: null,
    },
    { id: 25, name: "거울", description: "손거울 조각.", imageKey: null },
];

const MAX_SELECT = 4;

const InventoryOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const [selected, setSelected] = useState<number[]>([]);
    const [showLimitPopup, setShowLimitPopup] = useState(false);

    const handleSelect = (id: number) => {
        if (!selected.includes(id) && selected.length >= MAX_SELECT) {
            setShowLimitPopup(true);
            return;
        }

        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleClose = () => {
        closeOverlay();
        EventBus.emit(GAME_EVT.CLOSE_POPUP);
    };

    const handleConfirm = () => {
        if (selected.length > 0) {
            const items = ITEMS.filter((it) => selected.includes(it.id));

            EventBus.emit(GAME_EVT.CONFIRM_INVENTORY, {
                indices: selected.map((id) => id - 1),
                items: items.map((it) => it.name),
            });
        }
        handleClose();
    };

    return (
        <div className="overlay-backdrop">
            <div
                style={{
                    width: "min(100vw, 177.78vh)",
                    height: "min(56.25vw, 100vh)",
                    position: "relative",
                }}
            >
                {/* 배경 */}
                <img
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                    src="/assets/game/images/inventory/bg.png"
                    alt=""
                    draggable={false}
                />

                {/* 아이템 */}
                <div
                    style={{
                        position: "absolute",
                        top: "15%",
                        left: "10%",
                        width: "40%",
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "1%",
                    }}
                >
                    {ITEMS.map((item) => {
                        const isSelected = selected.includes(item.id);
                        const isDisabled =
                            !isSelected && selected.length >= MAX_SELECT;

                        return (
                            <div
                                key={item.id}
                                className={`inventory-item
                                    ${isSelected ? "selected" : ""}
                                    ${isDisabled ? "disabled" : ""}
                                `}
                                onClick={() => handleSelect(item.id)}
                            >
                                {item.imageKey ? (
                                    <img
                                        src={item.imageKey}
                                        alt={item.name}
                                        className="inventory-item-img"
                                    />
                                ) : (
                                    <div className="inventory-item-placeholder" />
                                )}

                                <div className="inventory-tooltip">
                                    <span className="inventory-tooltip-name">
                                        {item.name}
                                    </span>
                                    <span className="inventory-tooltip-desc">
                                        {item.description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showLimitPopup && (
                    <div className="limit-popup">
                        <div className="limit-popup-content">
                            <div className="limit-popup-text">
                                4개까지만 선택할 수 있습니다
                            </div>
                            <div
                                className="limit-popup-btn"
                                onClick={() => setShowLimitPopup(false)}
                            >
                                확인
                            </div>
                        </div>
                    </div>
                )}

                {/* 닫기 */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "20%",
                        padding: "1% 2.5%",
                        fontSize: "1.2vw",
                        backgroundColor: "yellow",
                        color: "black",
                        border: "2px solid black",
                        cursor: "pointer",
                    }}
                    onClick={handleClose}
                >
                    닫기
                </div>

                {/* 확인 */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "8%",
                        padding: "1% 2.5%",
                        fontSize: "1.2vw",
                        backgroundColor: "yellow",
                        color: "black",
                        border: "2px solid black",
                        cursor: selected.length === 0 ? "default" : "pointer",
                        opacity: selected.length === 0 ? 0.35 : 1,
                    }}
                    onClick={handleConfirm}
                >
                    확인
                </div>
            </div>
        </div>
    );
};

export default InventoryOverlay;
