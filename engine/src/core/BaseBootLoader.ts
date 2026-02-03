/**
 * BaseBootLoader
 * Author: Kim tae shin
 */
import Phaser from "phaser";
import { SceneX } from "./SceneX";

declare const external: any;

export class BaseBootLoader extends SceneX {
    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    preload() {
        this.loadRequired();
        this.loadAudios(); // 사운드 로드
        this.loadSpines(); // 스파인 로드
        this.loadImages(); // 이미지 로드
        this.loadVideos(); // 비디오 로드
    }

    create() {
        // this.scene.start('Interaction');
    }

    /** 필수 로드 */
    private loadRequired(): void {}

    /**
     * 공용 스파인을 로드 한다.
     * @param {string} $key
     */
    private loadCommonSpine($key: string): void {
        this.load.spineBinary(
            `${$key}_data`,
            `assets/spine/common/${$key}/${$key}.skel`
        );
        this.load.spineAtlas(
            `${$key}_atlas`,
            `assets/spine/common/${$key}/${$key}.atlas`
        );
    }

    // BootLoader에서 오버라이딩.
    // 사운드 로드
    public loadAudios(): void {}
    // 스파인 로드
    public loadSpines(): void {}
    // 이미지 로드
    public loadImages(): void {}
    // 비디오 로드
    public loadVideos(): void {}
}
