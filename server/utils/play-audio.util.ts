import path from "path";
import fs from "fs";
import player from "play-sound";

export const playAudio = (audioUrl: string) => {
  const audioPath = path.join(process.cwd(), audioUrl);

  if (!fs.existsSync(audioPath)) {
    console.error(`Audio file does not exist: ${audioPath}`);
    return;
  }

  player({ player: "mplayer" }).play(audioPath, (error) => {
    if (error) {
      console.error(`Error playing audio: ${error.message}`);
    } else {
      console.log(`Audio played: ${audioPath}`);
    }
  });
};
