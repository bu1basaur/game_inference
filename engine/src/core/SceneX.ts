import Phaser from "phaser";
import { BaseComponent, mixin } from "./BaseComponent";

import { AssetManifest } from "../types/Types";

export class SceneX extends Phaser.Scene {
    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    /**
     * 통합 자산 로더
     * @param manifest 로드할 자산 정보 객체
     */
    public loadAssets(manifest: AssetManifest): void {
        const { basePath, images, audio, spine } = manifest;

        if (images) {
            Object.entries(images).forEach(([category, files]) => {
                if (!files) return;
                Object.entries(files).forEach(([key, fileName]) => {
                    const resolvedName = fileName.includes(".")
                        ? fileName
                        : `${fileName}.png`;

                    const autoPath =
                        category === "root"
                            ? `${basePath}images/${resolvedName}`
                            : `${basePath}images/${category}/${resolvedName}`;

                    this.load.image(key, autoPath);
                });
            });
        }
        if (audio) {
            Object.entries(audio).forEach(([category, files]) => {
                if (!files) return; // undefined 스킵
                Object.entries(files).forEach(([key, fileName]) => {
                    const autoPath =
                        category === "root"
                            ? `${basePath}audio/${fileName}`
                            : `${basePath}audio/${category}/${fileName}`;
                    this.load.audio(key, autoPath);
                });
            });
        }

        if (spine) {
            const { basePath: spineBase, ...spineCategories } = spine as {
                basePath?: string;
                [category: string]: string[] | string | undefined;
            };
            const resolvedBase = spineBase ?? `${basePath}spine/`;

            Object.entries(spineCategories).forEach(([_, files]) => {
                if (!Array.isArray(files)) return;
                files.forEach((spineKey) =>
                    this.loadSpine(spineKey, resolvedBase)
                );
            });
        }
    }

    /**
     * 스파인 로드 (기존 로직 유지 및 경로 유연화)
     */
    public loadSpine($key: string, $basePath: string = "assets/spine/"): void {
        // basePath 끝에 /가 없다면 추가
        const path = $basePath.endsWith("/") ? $basePath : `${$basePath}/`;

        this.load.spineBinary(`${$key}_data`, `${path}${$key}/${$key}.skel`);
        this.load.spineAtlas(`${$key}_atlas`, `${path}${$key}/${$key}.atlas`);
    }

    public aDelay($ms: number): Promise<unknown> {
        return new Promise((resolve) => setTimeout(resolve, $ms));
    }
}

export interface SceneX extends BaseComponent {}
mixin(SceneX, BaseComponent);
