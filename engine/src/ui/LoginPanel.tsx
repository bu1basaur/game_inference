import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPanel = () => {
    const { name, setName } = useAuthStore();
    const [input, setInput] = useState(name);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        setName(trimmed);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
    };

    return (
        <div className="login-panel">
            {name ? (
                <span className="login-greeting">
                    안녕하세요,&nbsp;<b>{name}</b>
                    &nbsp;
                    <span className="login-change" onClick={() => setName("")}>
                        변경
                    </span>
                </span>
            ) : (
                <>
                    <input
                        className="login-input"
                        placeholder="이름을 입력하세요"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={20}
                        autoFocus
                    />
                    <button className="login-confirm-btn" onClick={handleSave}>
                        {saved ? "저장됨!" : "확인"}
                    </button>
                </>
            )}
        </div>
    );
};

export default LoginPanel;
