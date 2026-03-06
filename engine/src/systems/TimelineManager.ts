import { EventBus } from "../events/EventBus";
import { GAME_EVT } from "../events/GameEvt";
import { TimelineEntry } from "../game/data/Timeline";

export type TimelineEvent = {
    hour: number;
    minute: number;
    eventKey: string;
    triggered: boolean;
    condition?: () => boolean;
};

export class TimelineManager {
    // 게임 시간 (분 단위)
    private currentMinutes: number; // 현재 게임 시간 (분)
    private readonly START_HOUR = 7; // 영업 시작
    private readonly END_HOUR = 21; // 영업 종료

    private events: TimelineEvent[] = [];
    private isPaused = false; // 대화 중 정지

    // 실제 시간 1초 = 게임 시간 N분 (조절 가능)
    private readonly TIME_SCALE = 15;

    constructor() {
        this.currentMinutes = this.START_HOUR * 60;
    }

    /** 이벤트 등록 */
    register(hour: number, minute: number, eventKey: string) {
        this.events.push({ hour, minute, eventKey, triggered: false });
        // 시간순 정렬
        this.events.sort(
            (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
        );
    }

    /** 매 프레임 호출 (delta: ms) */
    tick(delta: number) {
        if (this.isPaused) return;
        this.currentMinutes += (delta / 1000) * this.TIME_SCALE;

        // 영업 종료
        if (this.currentMinutes >= this.END_HOUR * 60) {
            this.currentMinutes = this.END_HOUR * 60;
            EventBus.emit(GAME_EVT.TIMELINE, "shop_close");
            return;
        }

        // 이벤트 트리거 체크
        this.events
            .filter(
                (evt) =>
                    !evt.triggered &&
                    this.currentMinutes >= evt.hour * 60 + evt.minute
            )
            .forEach((evt) => {
                evt.triggered = true;
                // 조건 체크
                if (evt.condition && !evt.condition()) return;
                EventBus.emit(GAME_EVT.TIMELINE, evt.eventKey);
            });
    }

    /** 대화 중 시간 정지/재개 */
    pause() {
        this.isPaused = true;
    }
    resume() {
        this.isPaused = false;
    }

    /** 현재 시간 반환 */
    getTime(): { hour: number; minute: number } {
        const totalMin = Math.floor(this.currentMinutes);
        return {
            hour: Math.floor(totalMin / 60),
            minute: totalMin % 60,
        };
    }

    /** 타임라인 일괄 등록 */
    registerAll(events: TimelineEntry[]) {
        events.forEach(({ hour, minute, eventKey }) => {
            this.register(hour, minute, eventKey);
        });
    }

    /** HH:MM 포맷 */
    getTimeString(): string {
        const { hour, minute } = this.getTime();
        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
        )}`;
    }

    /** 테스트용 - 시간 강제 설정 */
    setTime(hour: number, minute: number = 0) {
        this.currentMinutes = hour * 60 + minute;
        // 해당 시간 이전 이벤트는 triggered 처리 (중복 발동 방지)
        this.events.forEach((evt) => {
            if (evt.hour * 60 + evt.minute <= this.currentMinutes) {
                evt.triggered = true;
            }
        });
    }
}
