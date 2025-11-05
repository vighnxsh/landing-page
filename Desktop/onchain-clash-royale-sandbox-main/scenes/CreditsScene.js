import Phaser from "phaser";
import { Scene } from "phaser";

const fontStyle = {
  fontSize: "12px",
  color: "#fff",
  stroke: "#000",
  strokeThickness: 2
};

let CREDITS_STRING = `
Code:
pyxld_kris
Austyn (cosmic)

Art:
pyxld_kris
ava (dskjsdkmlj)
guillermo
Calliope
auburn
otter
komo
brian

Special Thanks:
Original_Hojocat
`;

export default class CreditsScene extends Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;
            this.add
              .text(centerX, 20, "Credits", {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
              })
              .setOrigin(0.5, 0.5);

            this.add
              .text(centerX, 40, CREDITS_STRING, {
                fontSize: '6px',
                color: '#ffffff',
                fontFamily: 'Arial'
              })
              .setOrigin(0.5, 0);

    this.input.on("pointerdown", () => {
      this.scene.manager.stop("CreditsScene");
    });
  }
}
