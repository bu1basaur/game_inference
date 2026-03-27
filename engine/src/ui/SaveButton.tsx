import { useEffect, useState } from "react";
import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";

type SaveStatus = "idle" | "saving" | "done" | "error";

const LABEL: Record<SaveStatus, string> = {
    idle: "저장",
    saving: "저장 중...",
    done: "저장 완료!",
    error: "저장 실패",
};

const SaveButton = () => {
    const [status, setStatus] = useState<SaveStatus>("idle");

    useEffect(() => {
        const onResult = ({ success }: { success: boolean }) => {
            setStatus(success ? "done" : "error");
            setTimeout(() => setStatus("idle"), 2000);
        };
        EventBus.on(GAME_EVT.SAVE_RESULT, onResult);
        return () => {
            EventBus.off(GAME_EVT.SAVE_RESULT, onResult);
        };
    }, []);

    const handleSave = () => {
        if (status === "saving") return;
        setStatus("saving");
        EventBus.emit(GAME_EVT.SAVE);
    };

    return (
        <button
            className="save-btn"
            onClick={handleSave}
            disabled={status === "saving"}
        >
            {LABEL[status]}
        </button>
    );
};

export default SaveButton;
