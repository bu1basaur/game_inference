import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";

export class GamePauseController {
    private isPaused = false;

    constructor(private scene: Phaser.Scene) {}

    pause() {
        this.isPaused = true;
        this.scene.scene.pause();
        EventBus.emit(GAME_EVT.PAUSE);
    }

    resume() {
        this.isPaused = false;
        this.scene.scene.resume();
        this.scene.sound.resumeAll();
        EventBus.emit(GAME_EVT.RESUMED);
    }

    toggle() {
        this.isPaused ? this.resume() : this.pause();
    }

    get paused() {
        return this.isPaused;
    }
}
