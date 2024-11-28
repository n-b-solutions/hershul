import path from "path";
import fs from "fs";
import player from "play-sound";
import { execSync } from "child_process";
import { config } from "dotenv";
import { FileLogger } from "../utils/file-logger.util";

config();

const logger = new FileLogger({ prefix: "PlayAudio", level: "ALL" });

const isCommandAvailable = (command: string): boolean => {
  try {
    execSync(`where ${command}`); // Use 'where' instead of 'command -v' for Windows
    return true;
  } catch {
    return false;
  }
};

const getLinuxAudioPlayer = (): string => {
  if (isCommandAvailable("aplay")) {
    return "aplay";
  } else if (isCommandAvailable("paplay")) {
    return "paplay";
  } else {
    throw new Error("No suitable audio player found on Linux");
  }
};

export const playAudio = (audioUrl: string) => {
  try {
    const audioPath = path.join(process.cwd(), audioUrl);
    if (!fs.existsSync(audioPath)) {
      logger.error(`Audio file does not exist: ${audioPath}`);
      return;
    }

    const mplayerPath = process.env.VITE_MPLAYER_PATH || "mplayer";

    const audioPlayer = player({
      player:
        process.platform === "win32"
          ? mplayerPath
          : process.platform === "darwin"
          ? "afplay"
          : getLinuxAudioPlayer(),
    });

    audioPlayer.play(audioPath, (error) => {
      if (error) {
        logger.error(`Error playing audio: ${error.message}`);
      } else {
        logger.debug(`Audio played successfully: ${audioPath}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error(`Unknown error: ${error}`);
    }
  }
};
