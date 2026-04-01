// ──────────────────────────────────────────────────
// # 옵션 오버레이 (음량, BGM ON/OFF 등)
// ──────────────────────────────────────────────────

import { useOverlayStore } from "../../stores/useOverlayStore";
import { useSettingsStore } from "../../stores/useSettingsStore";

const OptionsOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const { bgmVolume, bgmEnabled, setBgmVolume, setBgmEnabled } =
        useSettingsStore();

    const handleBgmVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBgmVolume(Number(e.target.value) / 100);
    };

    const handleBgmToggle = () => {
        setBgmEnabled(!bgmEnabled);
    };

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
                <div className="options-title">옵션</div>

                {/* BGM 섹션 */}
                <div className="options-section">
                    <div className="options-section-label">BGM</div>

                    <div className="options-row">
                        <span className="options-row-label">음량</span>
                        <input
                            className="options-slider"
                            type="range"
                            min={0}
                            max={100}
                            value={Math.round(bgmVolume * 100)}
                            onChange={handleBgmVolume}
                            disabled={!bgmEnabled}
                        />
                        <span className="options-row-value">
                            {Math.round(bgmVolume * 100)}
                        </span>
                    </div>

                    <div className="options-row">
                        <span className="options-row-label">재생</span>
                        <button
                            className={`options-toggle${bgmEnabled ? " on" : " off"}`}
                            onClick={handleBgmToggle}
                        >
                            {bgmEnabled ? "ON" : "OFF"}
                        </button>
                    </div>
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

export default OptionsOverlay;
