import { TIMELINE_EVENTS } from "../data/Timeline";
import { BirdPoo } from "../objects/BirdPoo";
import { StoryManager } from "../../systems/StoryManager";
import { DialogueManager } from "../../systems/DialogueManager";
import { TimelineManager } from "../../systems/TimelineManager";

type DebugDeps = {
    scene: Phaser.Scene;
    storyManager: StoryManager;
    dialogueManager: DialogueManager;
    timelineManager: TimelineManager;
    poo?: BirdPoo;
    advanceStory: () => void;
};

export class GameDebugger {
    constructor(private deps: DebugDeps) {}

    startFrom(
        knot: string,
        hour?: number,
        minute?: number,
        runPrevious = false
    ) {
        const { storyManager, dialogueManager, timelineManager, advanceStory } =
            this.deps;

        if (hour !== undefined) {
            timelineManager.setTime(hour, minute ?? 0);
        }

        if (runPrevious) {
            const targetMinutes = (hour ?? 7) * 60 + (minute ?? 0);
            TIMELINE_EVENTS.filter(
                (evt) => evt.hour * 60 + evt.minute < targetMinutes
            ).forEach((evt) => {
                if (evt.condition && !evt.condition()) return;
                this.runSideEffectsOnly(evt.eventKey);
            });
        }

        storyManager.jumpTo(knot);
        dialogueManager.setVisible(true);
        timelineManager.pause();
        advanceStory();
    }

    private runSideEffectsOnly(eventKey: string) {
        const { scene, poo } = this.deps;

        if (eventKey === "scene_open") {
            this.deps.poo = new BirdPoo(scene);
            this.deps.poo.show();
        }
        if (eventKey === "fly_add") {
            poo?.addFly();
        }
    }
}
