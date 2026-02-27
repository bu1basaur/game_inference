import { AssetManifest } from "../../types/Assets";

export const COMMON_ASSETS: AssetManifest = {
    basePath: "assets/common/",
    images: {
        ui: { "btn-next": "image/ui/btn-next.png" },
        bg: { bg: "image/bg.png" },
    },
    audio: {
        // sfx: { "click-sound": "sound/sfx/click.mp3" },
    },
    spine: {
        // characters: ["char1", "char2"],
    },
};

export const GAME_ASSETS: AssetManifest = {
    basePath: "assets/",
    images: {
        // ui: { "btn-next": "image/ui/btn-next.png" },
    },
    audio: {
        // sfx: { "click-sound": "sound/sfx/click.mp3" },
    },
    spine: {
        characters: ["nyangi"],
    },
};
