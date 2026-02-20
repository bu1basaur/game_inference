import { SpinePlugin } from "@esotericsoftware/spine-phaser-v3";
import { Boot } from "./scenes/load/Boot";
import { Ending } from "./scenes/Ending";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/load/Preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: "game-container",
    backgroundColor: "#444444",
    scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    plugins: {
        scene: [
            {
                key: "spine.SpinePlugin",
                plugin: SpinePlugin,
                mapping: "spine",
            },
        ],
    },
    scene: [Boot, Preloader, MainMenu, MainGame, Ending],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

if (import.meta.hot) {
    import.meta.hot.accept(() => {
        window.location.reload();
    });
}

export default StartGame;
