// ──────────────────────────────────────────────────
// # 메인 메뉴 씬
// ──────────────────────────────────────────────────

import { GameObjects, Scene } from "phaser";
import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";
import { useSettingsStore } from "../../stores/useSettingsStore";

const MENU_ITEMS = [
    { label: "게임 시작", action: "start", x: 80, y: 690 },
    { label: "불러오기", action: "load", x: 80, y: 780 },
    { label: "옵션", action: "option", x: 80, y: 870 },
    { label: "나가기", action: "exit", x: 80, y: 960 },

    { label: "수집한 엔딩", action: "gallery", x: 1620, y: 800 },
    { label: "만든 사람들", action: "credits", x: 1620, y: 890 },
] as const;

type MenuAction = (typeof MENU_ITEMS)[number]["action"];

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    private _bgm: Phaser.Sound.WebAudioSound | null = null;
    private _unsubSettings?: () => void;

    constructor() {
        super("MainMenu");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        console.log("타이틀 생성");
        // 타이틀
        this.add
            .text(700, 350, "소마소마", {
                fontFamily: "Kkokkoma",
                fontSize: "180px",
                color: "#ffffff",
                padding: { bottom: 20 },
            })
            .setOrigin(0.5);

        // 메뉴 버튼
        const gap = 90;

        MENU_ITEMS.forEach(({ label, action, x, y }, i) => {
            this.createMenuButton(label, x, y, action);
        });

        // main_bgm 재생 (설정값 반영)
        const { bgmVolume, bgmEnabled } = useSettingsStore.getState();
        this.sound.stopByKey("main_bgm"); // 이전 인스턴스 정지
        this._bgm = this.sound.add("main_bgm", {
            loop: true,
            volume: bgmVolume,
        }) as Phaser.Sound.WebAudioSound;
        this._bgm.play();
        if (!bgmEnabled) this._bgm.setMute(true);

        // 설정 스토어 구독 → 변경 즉시 사운드에 반영
        this._unsubSettings = useSettingsStore.subscribe((state) => {
            if (!this._bgm) return;
            this._bgm.setVolume(state.bgmVolume);
            this._bgm.setMute(!state.bgmEnabled);
        });

        EventBus.emit(GAME_EVT.READY_SCENE, this);
    }

    private createMenuButton(
        label: string,
        x: number,
        y: number,
        action: MenuAction
    ) {
        console.log("메인 게임 시작 내용");

        const btn = this.add
            .text(x, y, label, {
                fontFamily: "Bunpil",
                fontSize: "54px",
                color: "#ffffff",
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        btn.on("pointerover", () => btn.setColor("#ffcc00"));
        btn.on("pointerout", () => btn.setColor("#ffffff"));
        btn.on("pointerdown", () => this.handleMenuAction(action));

        return btn;
    }

    private handleMenuAction(action: MenuAction) {
        switch (action) {
            case "start":
                this.sound.stopByKey("main_bgm");
                this.scene.start("Preloader");
                break;
            case "load":
                EventBus.once(GAME_EVT.LOAD_READY, () => {
                    this.sound.stopByKey("main_bgm");
                    this.scene.start("Preloader");
                });
                EventBus.emit(GAME_EVT.OPEN_LOAD_OVERLAY);
                break;
            case "option":
                EventBus.emit(GAME_EVT.OPEN_OPTIONS);
                break;
            case "gallery":
                EventBus.emit(GAME_EVT.OPEN_GALLERY);
                break;
            case "credits":
                EventBus.emit(GAME_EVT.OPEN_CREDITS);
                break;
            case "exit":
                break;
        }
    }

    shutdown() {
        this._unsubSettings?.();
        this._bgm?.stop();
        this._bgm = null;
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Preloader");
    }
}
