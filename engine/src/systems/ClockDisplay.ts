export class ClockDisplay {
    private scene: Phaser.Scene;
    private clockFace: Phaser.GameObjects.Image;
    private hourHandle: Phaser.GameObjects.Image;
    private minuteHandle: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.buildUI();
    }

    /** 시계 UI 배치 */
    private buildUI() {
        // 시계판 배경
        this.clockFace = this.scene.add
            .image(1430, 320, "clock-face")
            .setOrigin(0.5);

        // 시침
        this.hourHandle = this.scene.add
            .image(1430, 320, "clock-hour")
            .setOrigin(0.5, 0.8);

        //분침
        this.minuteHandle = this.scene.add
            .image(1430, 320, "clock-minute")
            .setOrigin(0.5, 0.8);
    }

    /** 시간 업데이트 */
    update(hour: number, minute: number) {
        const minuteDeg = (minute / 60) * 360;
        const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

        this.minuteHandle.setAngle(minuteDeg);
        this.hourHandle.setAngle(hourDeg);
    }
}
