import { Game } from "../scenes/Game";
import { BirdPoo } from "../objects/BirdPoo";
import { Trash } from "../objects/Trash";
import { TIMELINE_EVENTS } from "../data/Timeline";

export class GameDebugger {
    constructor(private game: Game) {}

    startFrom(knot: string, hour?: number, minute?: number, runPrev = true) {
        if (hour !== undefined) {
            this.game.timelineManager.setTime(hour, minute ?? 0);
        }

        if (runPrev) {
            const targetMinutes = (hour ?? 7) * 60 + (minute ?? 0);
            TIMELINE_EVENTS.filter(
                (evt) => evt.hour * 60 + evt.minute < targetMinutes
            ).forEach((evt) => {
                if (evt.condition && !evt.condition()) return;
                this.runSideEffectsOnly(evt.eventKey);
            });
        }

        this.game.storyManager.jumpTo(knot);
        this.game.dialogueManager.setVisible(true);
        this.game.timelineManager.pause();
        this.game.advanceStory();
    }

    private runSideEffectsOnly(eventKey: string) {
        if (eventKey === "scene_open") {
            this.game.poo = new BirdPoo(this.game);
            this.game.poo.show();
        }
        if (eventKey === "fly_add") {
            this.game.poo?.addFly();
        }
        if (eventKey === "scene_homeless") {
            this.game.trash = new Trash(this.game);
            this.game.trash.show(700, 650);
        }
    }
}
