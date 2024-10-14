import { Router } from "express";
import MessageController from "../controllers/message.controller";

const router = Router();

router.get("/", MessageController.get);
router.get("/:id", MessageController.getById);
router.post("/", MessageController.create);
router.put("/:id", MessageController.update);
router.delete("/:id", MessageController.delete);

export default router;
