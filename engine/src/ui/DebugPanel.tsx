// ──────────────────────────────────────────────────
// # 개발용 시간 점프 패널 (DEV 전용)
// ──────────────────────────────────────────────────

import { useState } from "react";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 ~ 21
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, ..., 55

const DebugPanel = () => {
    const [hour, setHour] = useState(7);
    const [minute, setMinute] = useState(0);

    const handleJump = () => {
        EventBus.emit(GAME_EVT.DEBUG_TIME_JUMP, { hour, minute });
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 8,
                left: 8,
                background: "rgba(0,0,0,0.8)",
                border: "1px solid #444",
                borderRadius: 4,
                padding: "5px 10px",
                color: "#4f4",
                fontSize: 12,
                zIndex: 9999,
                display: "flex",
                gap: 6,
                alignItems: "center",
                fontFamily: "monospace",
                userSelect: "none",
            }}
        >
            <span style={{ color: "#b1b1b1ff", fontSize: 12 }}>시간 변경</span>
            <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                style={{
                    background: "#111",
                    color: "#4f4",
                    border: "1px solid #444",
                    borderRadius: 3,
                    fontSize: 12,
                    padding: "1px 2px",
                }}
            >
                {HOURS.map((h) => (
                    <option key={h} value={h}>
                        {String(h).padStart(2, "0")}
                    </option>
                ))}
            </select>
            <span style={{ color: "#666" }}>:</span>
            <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                style={{
                    background: "#111",
                    color: "#4f4",
                    border: "1px solid #444",
                    borderRadius: 3,
                    fontSize: 12,
                    padding: "1px 2px",
                }}
            >
                {MINUTES.map((m) => (
                    <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                    </option>
                ))}
            </select>
            <button
                onClick={handleJump}
                style={{
                    background: "#0a200a",
                    color: "#4f4",
                    border: "1px solid #4f4",
                    borderRadius: 3,
                    padding: "0PX 8px 2px",
                    cursor: "pointer",
                    fontSize: 12,
                }}
            >
                이동
            </button>
        </div>
    );
};

export default DebugPanel;
