import { useState } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import "../styles/overlay.css";

const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "C",
    "+",
    "=",
];

const CalculatorOverlay = () => {
    const { closeOverlay } = useOverlayStore();
    const [display, setDisplay] = useState("");

    const press = (v: string) => {
        if (v === "C") {
            setDisplay("");
            return;
        }

        if (v === "=") {
            try {
                const result = Function(`"use strict"; return (${display})`)();
                setDisplay(result.toString());
            } catch {
                setDisplay("error");
            }
            return;
        }

        setDisplay((prev) => prev + v);
    };

    return (
        <div className="overlay-bg">
            <div className="overlay-box calculator">
                <div className="overlay-title">Calculator</div>

                <div className="calc-display">{display || "0"}</div>

                <div className="calc-grid">
                    {buttons.map((b, i) => (
                        <div
                            key={i}
                            className="calc-btn"
                            onClick={() => press(b)}
                        >
                            {b}
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

export default CalculatorOverlay;
