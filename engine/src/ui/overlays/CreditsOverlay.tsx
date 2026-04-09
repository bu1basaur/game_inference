// ──────────────────────────────────────────────────
// # 만든 사람들 (크레딧)
// ──────────────────────────────────────────────────

import { useOverlayStore } from "../../stores/useOverlayStore";

// ── 크레딧 데이터 ─────────────────────────────────
const CREDITS: { role: string; names: string[] }[] = [
    { role: "개발", names: ["대장상희"] },
    { role: "개발", names: ["빛수연"] },
    { role: "애니메이터", names: ["고트나경"] },
    { role: "애니메이터", names: ["갓은주"] },
];

const CreditsOverlay = () => {
    const { closeOverlay } = useOverlayStore();

    return (
        <div className="overlay-backdrop">
            <div
                className="overlay-panel-dark"
                style={{
                    width: 480,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                }}
            >
                <div className="options-title">만든 사람들</div>

                <div className="credits-list">
                    {CREDITS.map(({ role, names }, i) => (
                        <div key={i} className="credits-row">
                            <span className="credits-role">{role}</span>
                            <span className="credits-names">
                                {names.join(", ")}
                            </span>
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
        </div>
    );
};

export default CreditsOverlay;
