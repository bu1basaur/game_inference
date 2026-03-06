import { SceneX } from "../../../core/SceneX";
import { COMMON_ASSETS, GAME_ASSETS } from "../../constants/Assets";

export class Preloader extends SceneX {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.loadAssets(COMMON_ASSETS);
        this.loadAssets(GAME_ASSETS);
    }

    create() {
        this.scene.start("Game");
    }
}
