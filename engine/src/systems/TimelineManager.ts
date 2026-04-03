// ──────────────────────────────────────────────────
// # 게임 내 시간 흐름 + 이벤트 트리거
// ──────────────────────────────────────────────────

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
    private readonly TIME_SCALE = 10;
    private readonly DIALOGUE_SCALE = 0.2; // 대화 중 시간 속도. 걍 멈추니 너무 작위적임...
    private currentScale: number;

    constructor() {
        this.currentMinutes = this.START_HOUR * 60;
        this.currentScale = this.TIME_SCALE;
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
        this.currentMinutes += (delta / 1000) * this.currentScale;

        // 영업 종료
        if (this.currentMinutes >= this.END_HOUR * 60) {
            this.currentMinutes = this.END_HOUR * 60;
            EventBus.emit(GAME_EVT.TIMELINE, "CLOSE_SHOP");
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
                const time = `${String(evt.hour).padStart(2, "0")}:${String(evt.minute).padStart(2, "0")}`;
                // 조건 불충족 → 스킵 이벤트 발행
                if (evt.condition && !evt.condition()) {
                    EventBus.emit(GAME_EVT.TIMELINE_SKIP, { eventKey: evt.eventKey, time });
                    return;
                }
                EventBus.emit(GAME_EVT.TIMELINE, evt.eventKey);
            });
    }

    /** 대화 시작 - 느리게 */
    slowDown() {
        this.isPaused = false;
        this.currentScale = this.DIALOGUE_SCALE;
    }

    /** 대화 선택지 - 정지 */
    pause() {
        this.isPaused = true;
    }

    /** 대화 종료 - 정상 속도 */
    resume() {
        this.isPaused = false;
        this.currentScale = this.TIME_SCALE;
    }

    /** 현재 시간 반환 */
    getTime(): { hour: number; minute: number } {
        return {
            hour: Math.floor(this.currentMinutes / 60),
            minute: this.currentMinutes % 60,
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
        return `${String(hour).padStart(2, "0")}:${String(Math.floor(minute)).padStart(2, "0")}`;
    }

    /** 현재 진행 상태 스냅샷 반환 */
    getSnapshot(): { currentMinutes: number } {
        return { currentMinutes: this.currentMinutes };
    }

    /** 저장된 스냅샷으로 복원 (과거 이벤트는 triggered 처리) */
    restoreSnapshot(currentMinutes: number): void {
        this.currentMinutes = currentMinutes;
        this.events.forEach((e) => {
            if (e.hour * 60 + e.minute <= currentMinutes) {
                e.triggered = true;
            }
        });
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

    /** 디버그용 - 특정 시각 직전으로 설정 (해당 시각 이벤트는 아직 트리거 안 됨) */
    setTimeBeforeEvent(hour: number, minute: number): void {
        const targetMinutes = hour * 60 + minute;
        this.currentMinutes = targetMinutes - 0.1;
        this.events.forEach((evt) => {
            evt.triggered = evt.hour * 60 + evt.minute < targetMinutes;
        });
    }
}
