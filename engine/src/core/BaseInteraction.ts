/**
 * BaseBootLoader
 * Author: Kim tae shin
 */
import Phaser from "phaser";
import { SceneX } from "../core/SceneX";

type AudioTypes =
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

type KeyGroupType = Array<string>;

declare const external: any;

export class BaseInteraction extends SceneX {
    public audios: Record<string, AudioTypes> = {};
    public bgm: AudioTypes;

    private keyGroup: Array<KeyGroupType>;

    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);

        this.audios = {};
        this.keyGroup = [];
    }

    create() {
        // 공용 사운드 등록
        // this.addAudio('ending');

        this.onInit();
        this.render();
        this.hideLoadShot();
        this.onMounting();
    }

    /**
     * 사운드 키값으로 등록
     * @param $key
     * @param $groupIndex
     * @returns {AudioTypes} 사운드 객체를 리턴
     */
    public addAudio($key: string, $groupIndex = 0): AudioTypes {
        this.audios[$key] = this.sound.add($key);
        if (!this.keyGroup[$groupIndex]) this.keyGroup[$groupIndex] = [];

        // key가 이미 존재하지 않을 경우에만 추가
        if (!this.keyGroup[$groupIndex].includes($key)) {
            this.keyGroup[$groupIndex].push($key);
        }
        return this.audios[$key];
    }

    /**
     * 등록된 키값으로 사운드를 재생한다.
     * 재생 후 호출되는 콜백 함수를 넘겨 줄수 있다.
     * @param {string} $key
     * @param {Function} $callback
     */
    public playAudio($key: string, $callback?: Function): void {
        try {
            if (!this.audios[$key]) this.addAudio($key);
            this.audios[$key].play();
            if ($callback) {
                this.audios[$key].once("complete", () => {
                    $callback();
                });
            }
        } catch ($err) {
            new Error(`[${$key}] 사운드 재생에 실패했습니다.`);
        }
    }

    /**
     * 등록된 키값으로 사운드 재생 (Promise)
     * 재생 후 호출되는 콜백 함수를 넘겨 줄수 있다.
     * @param {string} $key
     * @param {Function} $callback
     * @return Promise<void>
     */
    public async aPlayAudio($key: string, $callback?: Function): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.audios[$key].play();
                this.audios[$key].once("complete", () => {
                    if ($callback) $callback();
                    resolve();
                });
            } catch ($err) {
                reject(new Error(`[${$key}] 사운드 재생에 실패했습니다.`));
            }
        });
    }

    /**
     * 해당 씬의 배경음악 키를 등록, 반복 재생한다.
     * @param {string} $bgm
     */
    public playBGM($bgm = "bgm"): void {
        this.bgm = this.sound.add($bgm);
        this.bgm.stop();
        this.bgm.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        });
    }

    /**
     * 그룹번호에 포함되는 사운드를 모두 종료한다.
     * @param {number} $groupIndex
     */
    public stopAudioGroup($groupIndex: number): void {
        const group = this.keyGroup[$groupIndex];
        if (group) {
            for (const key of group) {
                this.sound.stopByKey(key);
            }
        }
    }

    /**
     * 해당 그룹번호 키값들을 리턴한다.
     * @return Array<string> | null
     */
    public getAudioGroup($groupIndex: number): Array<string> | null {
        const group = this.keyGroup[$groupIndex];
        if (group) {
            return group as Array<string>;
        } else {
            return null;
        }
    }

    // override
    public onInit() {}
    public onMounting() {}

    /**
     * 인터렉션을 완료한다.
     * 아웃트로가 있다면 아웃트로 재생 -> 엔딩파티클 -> 종료
     * 아웃트로가 없다면 엔딩파티클 -> 종료
     */
    public classComplete(): void {
        // 재생중인 모든 사운드를 끈다.
        this.sound.stopAll();
        // 재생중인 모든 스파인을 멈춘다.

        // 모든 인터렉션을 막는다.
        this.input.enabled = false;
    }

    /** 로딩 화면 감추기 */
    private hideLoadShot(): void {
        const loadShot = document.getElementById("loadShot");
        if (loadShot) loadShot.style.display = "none";
    }

    protected render(): void {}
}
