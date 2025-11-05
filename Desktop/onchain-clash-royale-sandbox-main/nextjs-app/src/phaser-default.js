import * as PhaserNS from "phaser/dist/phaser.js";

// Default export behaves like importing `import Phaser from 'phaser'`
export default PhaserNS;

// Provide named exports used throughout the codebase
export const Phaser = PhaserNS;
export const Scene = PhaserNS.Scene;
export const Geom = PhaserNS.Geom;
export const GameObjects = PhaserNS.GameObjects;
