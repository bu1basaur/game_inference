import { SceneX } from "../../../core/SceneX";
import { COMMON_ASSETS } from "../../constants/Assets";

export class Preloader extends SceneX {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.loadAssets(COMMON_ASSETS);
        // this.loadAudios();
        // this.loadSpines();
        // this.loadImages();
        // this.loadVideos();
    }

    create() {
        this.scene.start("Game");
    }

    // /** 사운드 로드 */
    // public loadAudios(): void {}

    // /** 스파인 로드 */
    // public loadSpines(): void {}

    // /** 이미지 로드 */
    // public loadImages(): void {
    //     this.load.image("bg", "assets/common");
    // }

    // /** 비디오 로드 */
    // public loadVideos(): void {}
}
