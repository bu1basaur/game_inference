import { AssetManifest } from "../../types/Types";

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
            "clock-face": "clock-face",
            "clock-hour": "clock-hour",
            "clock-minute": "clock-minute",
            poo: "poo",
            fly: "fly",
            trash: "trash",
            note_1: "note_1",
            note_2: "note_2",
            note_3: "note_3",
            note_4: "note_4",
            note_5: "note_5",
            note_6: "note_6",
            loop_on: "loop_on",
            loop_off: "loop_off",
        },
    },
    spine: {
        basePath: "assets/spine/",
        characters: ["nyangi"],
    },
};
