import { AssetManifest } from "../../types/Assets";

export const COMMON_ASSETS: AssetManifest = {
    basePath: "assets/common/",
    images: {
        root: {
            bg: "bg", // → assets/common/images/bg.png
        },
        ui: {
            "btn-next": "btn-next", // → assets/common/images/ui/btn-next.png
        },
    },
    audio: {
        // sfx: { "click-sound": "click.mp3" }, // → assets/common/audio/sfx/click.mp3
    },
};

export const GAME_ASSETS: AssetManifest = {
    basePath: "assets/game/",
    images: {
        root: {
            dialogue: "dialogue",
            "icon-chat": "icon-chat",
        },
    },
    spine: {
        basePath: "assets/spine/",
        characters: ["nyangi"],
    },
};
