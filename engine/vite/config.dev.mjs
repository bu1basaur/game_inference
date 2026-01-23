import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [react()],
    server: {
        port: 8080,
        // 저장 시 HMR 대신 전체 페이지 새로고침을 강제하고 싶을 때
        hmr: true,
        // 만약 자동 업데이트가 아예 안 된다면 아래 설정을 추가 (특히 Windows/WSL 환경)
        watch: {
            usePolling: true,
        },
    },
});
