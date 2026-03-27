import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./firebase/auth"; // auth 초기화 (onAuthStateChanged 등록)

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
