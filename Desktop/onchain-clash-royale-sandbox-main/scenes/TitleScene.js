import { Scene } from "phaser";

class TitleScene extends Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Position text properly in the center
    const titleText = this.add
      .text(
        centerX,
        centerY - 15,
        "trenches.lol",
        {
          fontSize: '20px',
          color: 'red',
          fontFamily: 'Arial',
          fontWeight: 'bold'
        }
      )
      .setOrigin(0.5, 0.5);

    const subtitleText = this.add
      .text(
        centerX,
        centerY + 10,
        "Click or touch to begin!",
        {
          fontSize: '8px',
          color: 'white',
          fontFamily: 'Arial'
        }
      )
      .setOrigin(0.5, 0.5);

    // Make the text clickable
    titleText.setInteractive();
    subtitleText.setInteractive();
    
    titleText.on('pointerdown', () => {
      this.nextScene();
    });
    
    subtitleText.on('pointerdown', () => {
      this.nextScene();
    });

    // Also make the entire scene clickable
    this.input.on("pointerdown", () => {
      this.nextScene();
    });
  }

  nextScene() {
    this.scene.start("PlayScene");
  }
}

export default TitleScene;
