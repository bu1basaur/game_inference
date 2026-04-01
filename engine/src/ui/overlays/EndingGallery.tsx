// ──────────────────────────────────────────────────
// # 수집한 엔딩 갤러리
// ──────────────────────────────────────────────────

import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";

// ── 엔딩 데이터 ──────────────────────────────────
// 추후 Firebase 연동 시 이 배열을 서버 데이터로 교체
// savedAt: 해금된 엔딩의 저장 일시
const ENDINGS = [
    {
        id: 1,
        title: "엔딩 1",
        description: "...",
        unlocked: true,
        savedAt: "2025.03.01 14:23",
    },
    {
        id: 2,
        title: "엔딩 2",
        description: "...",
        unlocked: true,
        savedAt: "2025.03.02 09:11",
    },
    {
        id: 3,
        title: "엔딩 3",
        description: "...",
        unlocked: true,
        savedAt: "2025.03.03 22:47",
    },
    { id: 4,  title: "엔딩 4",  description: "...", unlocked: false, savedAt: undefined },
    { id: 5,  title: "엔딩 5",  description: "...", unlocked: false, savedAt: undefined },
    { id: 6,  title: "엔딩 6",  description: "...", unlocked: false, savedAt: undefined },
    { id: 7,  title: "엔딩 7",  description: "...", unlocked: false, savedAt: undefined },
    { id: 8,  title: "엔딩 8",  description: "...", unlocked: false, savedAt: undefined },
    { id: 9,  title: "엔딩 9",  description: "...", unlocked: false, savedAt: undefined },
    { id: 10, title: "엔딩 10", description: "...", unlocked: false, savedAt: undefined },
    { id: 11, title: "엔딩 11", description: "...", unlocked: false, savedAt: undefined },
    { id: 12, title: "엔딩 12", description: "...", unlocked: false, savedAt: undefined },
    { id: 13, title: "엔딩 13", description: "...", unlocked: false, savedAt: undefined },
    { id: 14, title: "엔딩 14", description: "...", unlocked: false, savedAt: undefined },
    { id: 15, title: "엔딩 15", description: "...", unlocked: false, savedAt: undefined },
    { id: 16, title: "엔딩 16", description: "...", unlocked: false, savedAt: undefined },
];

type Ending = (typeof ENDINGS)[number];

const EndingGallery = () => {
    const { closeOverlay } = useOverlayStore();
    const [selected, setSelected] = useState<Ending | null>(null);

    const unlockedCount = ENDINGS.filter((e) => e.unlocked).length;

    return (
        <div className="overlay-backdrop">
            <div
                className="overlay-panel-dark"
                style={{
                    width: 800,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    position: "relative",
                }}
            >
                {/* 헤더 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                    }}
                >
                    <div className="options-title">수집한 엔딩</div>
                    <div className="gallery-count">
                        {unlockedCount} / {ENDINGS.length}
                    </div>
                </div>

                {/* 그리드 */}
                <div className="gallery-grid">
                    {ENDINGS.map((ending) => (
                        <div
                            key={ending.id}
                            className={`gallery-card${
                                ending.unlocked ? " unlocked" : " locked"
                            }`}
                            onClick={() =>
                                ending.unlocked && setSelected(ending)
                            }
                        >
                            {ending.unlocked ? (
                                <>
                                    <span className="gallery-card-title">
                                        {ending.title}
                                    </span>
                                    <div className="gallery-tooltip">
                                        <span className="gallery-tooltip-num">
                                            ENDING #{ending.id}
                                        </span>
                                        <span className="gallery-tooltip-title">
                                            {ending.title}
                                        </span>
                                        <span className="gallery-tooltip-date">
                                            {ending.savedAt ?? "날짜 정보 없음"}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="gallery-lock">🔒</span>
                            )}
                        </div>
                    ))}
                </div>

                <div
                    className="overlay-btn"
                    style={{ alignSelf: "flex-start" }}
                    onClick={closeOverlay}
                >
                    닫기
                </div>
            </div>

            {/* 엔딩 상세 */}
            {selected && (
                <div
                    className="overlay-backdrop"
                    style={{ zIndex: 1100 }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="overlay-panel-dark"
                        style={{ width: 480, padding: 32 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="options-title"
                            style={{ marginBottom: 16 }}
                        >
                            {selected.title}
                        </div>
                        <div className="gallery-detail-desc">
                            {selected.description}
                        </div>
                        <div
                            className="overlay-btn"
                            style={{ marginTop: 24 }}
                            onClick={() => setSelected(null)}
                        >
                            닫기
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EndingGallery;
