import { Walkers } from "../classes/entities/troops";

// Dynamically populate the animations from our Troop classes
const animNames = ["npc"]; // Default animation
for (const troopClass of Object.values(Walkers)) {
  animNames.push(troopClass.ANIM_KEY_PREFIX);
}

function genAnims(scene) {
  // Create the animations we need from the player spritesheet
  const anims = scene.anims;

  for (let i = 0; i < animNames.length; i++) {
    const anim = animNames[i];

    // Check if the texture exists before creating animations
    if (scene.textures.exists(anim)) {
      try {
        anims.create({
          key: `${anim}--front`,
          frames: anims.generateFrameNumbers(anim, {
            start: 0,
            end: 0
          }),
          frameRate: 3,
          repeat: -1
        });
        anims.create({
          key: `${anim}--back`,
          frames: anims.generateFrameNumbers(anim, {
            start: 1,
            end: 1
          }),
          frameRate: 12,
          repeat: -1
        });
        anims.create({
          key: `${anim}--side`,
          frames: anims.generateFrameNumbers(anim, {
            start: 2,
            end: 2
          }),
          frameRate: 12,
          repeat: -1
        });
      } catch (e) {
        console.warn(`Failed to create animations for ${anim}:`, e);
      }
    } else {
      console.warn(`Texture ${anim} not found, skipping animation creation`);
    }
  }
}

export default genAnims;
