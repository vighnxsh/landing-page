import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const phaserShimPath = path.resolve(__dirname, "src/phaser-default.js");

export default {
  experimental: {
    externalDir: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "phaser$": phaserShimPath
    };
    return config;
  }
};
