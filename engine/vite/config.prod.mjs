// ──────────────────────────────────────────────────
// # 프로덕션 빌드 설정
// ──────────────────────────────────────────────────

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

const phasermsg = () => {
    return {
        name: "phasermsg",
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            const line =
                "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            process.stdout.write(`${line}\n${msg}\n${line}\n`);

            process.stdout.write(`✨ Done ✨\n`);
        },
    };
};

export default defineConfig({
    base: "./",
    plugins: [react(), phasermsg(), inkPlugin()],
    logLevel: "warning",
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});
