import { Router } from "express";
import MessageController from "../controllers/message.controller";
import { upload } from "../middlewares/upload-audio.middleware";

const router = Router();

router.get("/", MessageController.get);
router.get("/:id", MessageController.getById);
router.post("/", upload.single("audioBlob"), MessageController.create);
router.put("/:id", MessageController.update);
router.delete("/:id", MessageController.delete);

export default router;
