import { BaseBootLoader } from "../../../core/BaseBootLoader";

export class Preloader extends BaseBootLoader {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.loadAudios();
        this.loadSpines();
        this.loadImages();
        this.loadVideos();
    }

    create() {
        this.scene.start("Game");
    }

    /** 사운드 로드 */
    public loadAudios(): void {}

    /** 스파인 로드 */
    public loadSpines(): void {}

    /** 이미지 로드 */
    public loadImages(): void {}

    /** 비디오 로드 */
    public loadVideos(): void {}
}
