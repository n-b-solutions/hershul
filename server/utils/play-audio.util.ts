import path from "path";
import fs from "fs";
import player from "play-sound";
import { execSync } from "child_process";

const isCommandAvailable = (command: string): boolean => {
  try {
    execSync(`command -v ${command}`);
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
      console.error(`Audio file does not exist: ${audioPath}`);
      return;
    }

    const audioPlayer = player({
      player:
        process.platform === "win32"
          ? "mplayer"
          : process.platform === "darwin"
          ? "afplay"
          : getLinuxAudioPlayer(),
    });

    audioPlayer.play(audioPath, (error) => {
      if (error) {
        console.error(`Error playing audio: ${error.message}`);
      } else {
        console.log(`Audio played: ${audioPath}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unknown error: ${error}`);
    }
  }
};
