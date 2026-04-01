// ──────────────────────────────────────────────────
// # 불러오기 (저장 슬롯 목록)
// ──────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useSaveStore } from "../../stores/useSaveStore";
import { listSaves, loadSave, SaveSlot } from "../../services/SaveService";
import { ensureSignedIn } from "../../firebase/auth";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

const MAX_SLOTS = 10;

const formatGameTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const formatDate = (slot: SaveSlot) => {
    if (!slot.savedAt?.toDate) return "-";
    return slot.savedAt.toDate().toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const LoadOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const setPendingLoad = useSaveStore((s) => s.setPendingLoad);

    const [slots, setSlots] = useState<SaveSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const userId = await ensureSignedIn();
                const saves = await listSaves(userId);
                setSlots(saves);
            } catch (e) {
                console.error("[불러오기] 목록 조회 실패", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSelect = async (slot: SaveSlot) => {
        if (selecting) return;
        setSelecting(slot.id);
        try {
            const userId = await ensureSignedIn();
            const save = await loadSave(userId, slot.id);
            if (!save) return;

            setPendingLoad(save);
            closeOverlay();
            EventBus.emit(GAME_EVT.LOAD_READY);
        } catch (e) {
            console.error("[불러오기] 실패", e);
            setSelecting(null);
        }
    };

    // 항상 MAX_SLOTS 길이의 배열 생성 (빈 슬롯은 null)
    const slotGrid: (SaveSlot | null)[] = Array.from(
        { length: MAX_SLOTS },
        (_, i) => slots[i] ?? null
    );

    return (
        <div className="overlay-backdrop">
            <div
                className="overlay-panel-dark"
                style={{
                    width: 640,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div className="load-title">불러오기</div>

                {loading ? (
                    <div className="load-status">불러오는 중...</div>
                ) : (
                    <div className="load-list">
                        {slotGrid.map((slot, i) =>
                            slot ? (
                                <div
                                    key={slot.id}
                                    onClick={() => handleSelect(slot)}
                                    className={`load-slot${
                                        selecting === slot.id ? " selecting" : ""
                                    }`}
                                >
                                    <div className="load-slot-left">
                                        <span className="load-slot-date">
                                            #{i + 1} &nbsp;
                                            {formatDate(slot)}
                                        </span>
                                        <span className="load-slot-name">
                                            {slot.playerName ?? "이름 없음"}
                                        </span>
                                    </div>
                                    <div className="load-slot-right">
                                        <span>
                                            게임 시간{" "}
                                            {formatGameTime(slot.timelineMinutes)}
                                        </span>
                                        <span>쪽지 {slot.notes.length}개</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={`empty-${i}`} className="load-slot empty">
                                    <div className="load-slot-left">
                                        <span className="load-slot-date">
                                            #{i + 1}
                                        </span>
                                        <span className="load-slot-empty-label">
                                            빈 슬롯
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

                <div
                    className="overlay-btn"
                    style={{ marginTop: 8, alignSelf: "flex-start" }}
                    onClick={closeOverlay}
                >
                    닫기
                </div>
            </div>
        </div>
    );
};

export default LoadOverlay;
