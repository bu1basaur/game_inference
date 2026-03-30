// ──────────────────────────────────────────────────
// # 씬 일시정지/재개 처리
// ──────────────────────────────────────────────────

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

    /** 팝업 열릴 때 - 씬 정지 */
    pauseForPopup() {
        this.scene.scene.pause();
    }

    /** 팝업 닫히면 - 씬 재개 */
    resumeForPopup() {
        this.scene.scene.resume();
    }

    get paused() {
        return this.isPaused;
    }
}
