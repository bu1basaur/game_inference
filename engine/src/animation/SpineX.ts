import "phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser-v3";

declare module "phaser" {
    interface Scene {
        spine: SpinePlugin;
    }
    namespace GameObjects {
        interface GameObjectFactory {
            spine(
                x: number,
                y: number,
                key: string,
                animationName?: string,
                loop?: boolean
            ): any;
        }
    }
}
