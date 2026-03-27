import { Story } from "inkjs";

export type StoryStep = {
    text: string;
    speaker?: string;
    emotion?: string;
    events: string[];
    choices: string[];
};

export class StoryManager {
    private story: Story;
    private readonly COLOR_MAP: Record<string, string> = {
        red: "#ff1111",
        blue: "#1199ff",
        green: "#11ff99",
        yellow: "#ffee11",
        orange: "#FF9D40",
        gray: "#aaaaaa",
        // 필요시 추가
    };

    constructor(storyJson: object) {
        this.story = new Story(storyJson);
    }

    static async load(path: string): Promise<StoryManager> {
        const res = await fetch(path);
        const json = await res.json();
        return new StoryManager(json);
    }

    next(): StoryStep | null {
        if (!this.story.canContinue && this.story.currentChoices.length === 0) {
            return null;
        }

        if (this.story.canContinue) {
            const raw = this.story.Continue() ?? "";
            const tags = this.story.currentTags ?? [];
            const text = this.restoreColor(raw.trim()).replace(/\\n/g, "\n");

            return {
                text: text.trim(),
                choices: this.story.currentChoices.map((c) => c.text),
                events: [],
                ...this.parseTags(tags),
            };
        }
        // 선택지만 있는 경우
        return {
            text: "",
            choices: this.story.currentChoices.map((c) => c.text),
            events: [],
        };
    }

    choose(index: number): void {
        this.story.ChooseChoiceIndex(index);
    }

    private parseTags(tags: string[]): Partial<StoryStep> {
        const result: Partial<StoryStep> = { events: [] };

        tags.forEach((tag) => {
            const [key, ...rest] = tag.split(":").map((s) => s.trim());
            const value = rest.join(":"); // value에 콜론 있을 경우 대비
            if (key === "speaker") result.speaker = value;
            else if (key === "emotion") result.emotion = value;
            else if (key === "event") result.events!.push(value);
        });

        return result;
    }

    private restoreColor(text: string): string {
        return text.replace(/\[color=(\w+)\]/g, (_, colorName) => {
            const hex = this.COLOR_MAP[colorName] ?? colorName;
            return `[color=${hex}]`;
        });
    }

    jumpTo(knot: string): void {
        this.story.ChoosePathString(knot);
    }

    getStateJson(): string {
        return this.story.state.ToJson();
    }

    loadStateJson(json: string): void {
        this.story.state.LoadJson(json);
    }
}
