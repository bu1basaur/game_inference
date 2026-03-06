export type RadioChannel = "music" | "news" | "off";

class GameStateClass {
    private radioChannel: RadioChannel = "off";

    setRadioChannel(channel: RadioChannel) {
        this.radioChannel = channel;
    }

    isRadioOn(channel: RadioChannel): boolean {
        return this.radioChannel === channel;
    }

    getRadioChannel(): RadioChannel {
        return this.radioChannel;
    }
}

// 싱글톤으로 관리
export const GameState = new GameStateClass();
