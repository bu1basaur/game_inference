import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function inkPlugin() {
    return {
        name: "ink-compiler",
        buildStart() {
            const mainInk = path.resolve("public/assets/story/main.ink");
            if (fs.existsSync(mainInk)) {
                compileInk(mainInk);
            }
        },
        handleHotUpdate({ file, server }) {
            if (file.endsWith(".ink")) {
                const mainInk = path.resolve("public/assets/story/main.ink");
                compileInk(mainInk);

                // main.json이 바뀐 걸 Vite에 알려서 HMR 트리거
                server.ws.send({
                    type: "full-reload",
                });
            }
        },
    };
}

function compileInk(filePath) {
    const outPath = filePath.replace(".ink", ".json");
    const inklecate = path.resolve("tools/inklecate/inklecate.exe");
    try {
        execSync(`"${inklecate}" -o "${outPath}" "${filePath}"`);
        console.log(`✅ ink compiled: ${path.basename(outPath)}`);
    } catch (e) {
        console.error(`❌ ink compile failed:`, e.message);
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [react(), inkPlugin()],
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
