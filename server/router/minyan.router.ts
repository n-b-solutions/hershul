import express, { Request, Response } from "express";
import MinyanListController from "../controllers/minyan.controller";
const MinyanListRouter = express.Router();

MinyanListRouter.get("/", (req: Request, res: Response) => {
  MinyanListController.get(req, res);
});

MinyanListRouter.get(
  "/getMinyanimByDateType",
  (req: Request, res: Response) => {
    MinyanListController.getByDateType(req, res);
  }
);
MinyanListRouter.get("/:id", (req: Request, res: Response) => {
  MinyanListController.getById(req, res);
});
MinyanListRouter.get(
  "/import/count/:category",
  (req: Request, res: Response) => {
    MinyanListController.getCountMinyanByCategory(req, res);
  }
);
MinyanListRouter.post("/", (req: Request, res: Response) => {
  MinyanListController.post(req, res);
});
MinyanListRouter.post("/import/:category", (req: Request, res: Response) => {
  MinyanListController.postDuplicateMinyanByCategory(req, res);
});

MinyanListRouter.put("/:id", (req: Request, res: Response) => {
  MinyanListController.put(req, res);
});

MinyanListRouter.delete("/:id", (req: Request, res: Response) => {
  MinyanListController.delete(req, res);
});

export default MinyanListRouter;
