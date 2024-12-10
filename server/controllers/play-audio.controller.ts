import { Request, Response } from "express";
import { playAudio } from "../utils/play-audio.util";

const PlayAudioController = {
  play: (req: Request, res: Response): void => {
    const { audioUrl } = req.body;
    if (!audioUrl) {
      res.status(400).send("Audio URL is required");
    }

    playAudio(audioUrl);
    res.status(200).send("Audio is playing");
  },
};

export default PlayAudioController;
