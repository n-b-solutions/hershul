import express, { Request, Response } from "express";
import MinyanController from "../controllers/minyan.controller";
const MinyanListRouter = express.Router();

MinyanListRouter.get("/", (req: Request, res: Response) => {
  MinyanController.get(req, res);
});
MinyanListRouter.get("/getCalendar/:date", (req: Request, res: Response) => {
  MinyanController.getCalendar(req, res);
});
MinyanListRouter.get(
  "/getMinyanimByDateType",
  (req: Request, res: Response) => {
    MinyanController.getByDateType(req, res);
  }
);
MinyanListRouter.get("/:id", (req: Request, res: Response) => {
  MinyanController.getById(req, res);
});
MinyanListRouter.get(
  "/import/count/:category",
  (req: Request, res: Response) => {
    MinyanController.getCountMinyanByCategory(req, res);
  }
);
MinyanListRouter.post("/", (req: Request, res: Response) => {
  MinyanController.post(req, res);
});
MinyanListRouter.post("/import/:category", (req: Request, res: Response) => {
  MinyanController.postDuplicateMinyanByCategory(req, res);
});
MinyanListRouter.put("/addInactiveDates/:id", (req: Request, res: Response) => {
  MinyanController.addInactiveDates(req, res);
});
MinyanListRouter.put(
  "/removeInactiveDates/:id",
  (req: Request, res: Response) => {
    MinyanController.removeInactiveDates(req, res);
  }
);
MinyanListRouter.put(
  "/updateInactiveDate/:id",
  (req: Request, res: Response) => {
    MinyanController.updateInactiveDate(req, res);
  }
);
MinyanListRouter.put("/:id", (req: Request, res: Response) => {
  MinyanController.put(req, res);
});

MinyanListRouter.delete("/:id", (req: Request, res: Response) => {
  MinyanController.delete(req, res);
});

export default MinyanListRouter;