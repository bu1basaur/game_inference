// ──────────────────────────────────────────────────
// # 스파인 인스턴스 래퍼
// ──────────────────────────────────────────────────

const ANIM_ALIAS: Record<string, string> = {
    idle:       'idle_1',
    bored:      'idle_2',
    angry:      'idle_3',
    happy:      'idle_4',
    simurok:    'idle_5',
    walk:       'idle_6',
};

export class SpineX {
    constructor(private spine: any) {}

    /** 애니메이션 설정 (alias 자동 변환) */
    setAnim(anim: string, loop: boolean = true): this {
        const resolved = ANIM_ALIAS[anim] ?? anim;
        this.spine?.animationState?.setAnimation(0, resolved, loop);
        return this;
    }

    /** 스킨 설정 */
    setSkin(skin: string): this {
        if (this.spine?.skeleton) {
            this.spine.skeleton.setSkinByName(skin);
            this.spine.skeleton.setSlotsToSetupPose();
        }
        return this;
    }

    // ── 애니메이션 단축 메서드 ──────────────────────────

    /** 화난 상태 (idle_3) */
    angry(): this { return this.setAnim('idle_3'); }

    /** 즐거운 상태 (idle_4) */
    happy(): this { return this.setAnim('idle_4'); }

    /** 시무룩/당황 상태 (idle_5) */
    simurok(): this { return this.setAnim('idle_5'); }

    /** 왼쪽 보행 (idle_6) */
    walkLeft(): this { return this.setAnim('idle_6'); }

    /** 기본 대기 1 (idle_1) */
    idle1(): this { return this.setAnim('idle_1'); }

    /** 딴짓/따분함 (idle_2) */
    bored(): this { return this.setAnim('bored'); }

    // ── Mix 설정 ──────────────────────────────────────

    /** 모든 애니메이션 조합에 mix 설정 (전환 시 튀는 현상 방지) */
    setAllMix(duration: number = 0.2): this {
        const data = this.spine?.animationState?.data;
        if (!data) return this;
        const anims: any[] = this.spine.skeleton?.data?.animations ?? [];
        for (const a of anims) {
            for (const b of anims) {
                if (a !== b) data.setMix(a.name, b.name, duration);
            }
        }
        return this;
    }

    // ── 스킨 단축 메서드 ───────────────────────────────

    /** 말하는 입 스킨 */
    talk(): this { return this.setSkin('mouth_talk'); }

    /** 닫힌 입 스킨 */
    still(): this { return this.setSkin('mouth_still'); }

    get raw(): any {
        return this.spine;
    }
}
