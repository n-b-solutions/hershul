import { NextFunction, Request, Response, Router } from "express";
import MinyanController from "../controllers/minyan.controller";
const MinyanListRouter = Router();

MinyanListRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  MinyanController.get(req, res, next);
});
MinyanListRouter.get(
  "/getCalendar/:date",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.getCalendar(req, res, next);
  }
);
MinyanListRouter.get(
  "/getMinyanimByDateType",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.getByDateType(req, res, next);
  }
);
MinyanListRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.getById(req, res, next);
  }
);
MinyanListRouter.get(
  "/import/count/calendar/:selectedDate",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.getCountMinyanByCalendar(req, res, next);
  }
);
MinyanListRouter.get(
  "/import/count/:category",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.getCountMinyanByCategory(req, res, next);
  }
);
MinyanListRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.post(req, res, next);
  }
);
MinyanListRouter.post(
  "/import",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.postDuplicateMinyanByCategory(req, res, next);
  }
);
MinyanListRouter.put("/setSteadyFlagForActiveMinyans", (req, res, next) => {
  MinyanController.setSteadyFlagForActiveMinyans(req, res, next);
});
MinyanListRouter.put(
  "/addInactiveDates/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.addInactiveDates(req, res, next);
  }
);
MinyanListRouter.put(
  "/removeInactiveDates/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.removeInactiveDates(req, res, next);
  }
);
MinyanListRouter.put(
  "/updateInactiveDate/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.updateInactiveDate(req, res, next);
  }
);
MinyanListRouter.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.put(req, res, next);
  }
);

MinyanListRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    MinyanController.delete(req, res, next);
  }
);

export default MinyanListRouter;
