import { Router } from "express";
import PlayAudioController from "../controllers/play-audio.controller";

const router = Router();

router.post("/", PlayAudioController.play);

export default router;
