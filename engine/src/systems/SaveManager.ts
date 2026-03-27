import { StoryManager } from "./StoryManager";
import { TimelineManager } from "./TimelineManager";
import { useNoteStore } from "../stores/useNoteStore";
import { useAuthStore } from "../stores/useAuthStore";
import { saveGame } from "../services/SaveService";
import { ensureSignedIn } from "../firebase/auth";

export class SaveManager {
    constructor(
        private storyManager: StoryManager,
        private timelineManager: TimelineManager
    ) {}

    async save(): Promise<void> {
        const userId = await ensureSignedIn();
        const { currentMinutes } = this.timelineManager.getSnapshot();

        const data = {
            storyState: this.storyManager.getStateJson(),
            timelineMinutes: currentMinutes,
            notes: useNoteStore.getState().notes,
            playerName: useAuthStore.getState().name || undefined,
        };

        await saveGame(userId, data);

        const h = Math.floor(currentMinutes / 60);
        const m = String(Math.round(currentMinutes % 60)).padStart(2, "0");
        console.log("=== 저장 완료 ===");
        console.log("플레이어:", data.playerName ?? "(없음)");
        console.log("게임 시간:", `${h}:${m}`);
        console.log("수집 쪽지:", data.notes.length, "개");
    }
}
