import { Request, Response, Router } from "express";
import MessageController from "../controllers/message.controller";
import { upload } from "../config/upload.config";

const MessageRouter = Router();

MessageRouter.get("/", async (req: Request, res: Response) => {
  MessageController.get(req, res);
});

MessageRouter.get("/:id", (req: Request, res: Response) => {
  MessageController.getById(req, res);
});

MessageRouter.post(
  "/",
  upload.single("audioBlob"),
  (req: Request, res: Response) => {
    MessageController.post(req, res);
  }
);
MessageRouter.delete("/:id", (req: Request, res: Response) => {
  MessageController.delete(req, res);
});

export default MessageRouter;
