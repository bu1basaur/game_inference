import Phaser from "phaser";
import { BaseComponent, mixin } from "./BaseComponent";

/** 자산 관리를 위한 인터페이스 정의 */
interface AssetManifest {
    basePath: string;
    images?: Record<string, Record<string, string>>; // { category: { key: path } }
    audio?: Record<string, Record<string, string>>;
    video?: Record<string, Record<string, string>>;
    spine?: Record<string, string[]>; // { category: [spine_keys] }
}

export class SceneX extends Phaser.Scene {
    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    /**
     * 통합 자산 로더
     * @param manifest 로드할 자산 정보 객체
     */
    public loadAssets(manifest: AssetManifest): void {
        const { basePath, ...assetTypes } = manifest;

        Object.entries(assetTypes).forEach(([type, categories]) => {
            if (!categories) return;

            Object.entries(categories).forEach(([category, files]) => {
                // files가 객체인 경우 (이미지, 사운드 등)
                if (typeof files === "object" && !Array.isArray(files)) {
                    Object.entries(files).forEach(([key, fileName]) => {
                        const fullPath = `${basePath}${fileName}`;

                        switch (type) {
                            case "images":
                                this.load.image(key, fullPath);
                                break;
                            case "audio":
                                this.load.audio(key, fullPath);
                                break;
                            case "video":
                                this.load.video(key, fullPath);
                                break;
                        }
                    });
                }
                // files가 배열인 경우 (기존 Spine 로직 활용)
                else if (Array.isArray(files) && type === "spine") {
                    files.forEach((spineKey) =>
                        this.loadSpine(spineKey, basePath)
                    );
                }
            });
        });
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
