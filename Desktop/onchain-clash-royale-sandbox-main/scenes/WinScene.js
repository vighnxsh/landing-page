import { Scene } from "phaser";

class WinScene extends Scene {
  constructor() {
    super("WinScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#77dd77");
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

            this.add
              .text(centerX, centerY - 10, "You win!", {
                fontSize: '12px',
                color: '#000000',
                fontFamily: 'Arial',
                fontWeight: 'bold'
              })
              .setOrigin(0.5, 0.5);

            this.add
              .text(centerX, centerY + 8, "Click or touch to restart!", {
                fontSize: '8px',
                color: '#000000',
                fontFamily: 'Arial'
              })
              .setOrigin(0.5, 0.5);

    this.input.on("pointerdown", () => {
      this.nextScene();
    });
  }

  nextScene() {
    this.scene.start("TitleScene");
  }
}

export default WinScene;
