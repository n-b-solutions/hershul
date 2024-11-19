import { Router } from "express";
import LuachMinyanController from "../controllers/luach-minyan.controller";

const LuachMinyanRouter = Router();

LuachMinyanRouter.get("/", LuachMinyanController.get);
LuachMinyanRouter.get("/getCalendar/:date", LuachMinyanController.getCalendar);
LuachMinyanRouter.get(
  "/getMinyanimByDateType",
  LuachMinyanController.getByDateType
);
LuachMinyanRouter.get("/:id", LuachMinyanController.getById);
LuachMinyanRouter.get(
  "/import/count/calendar/:selectedDate",
  LuachMinyanController.getCountMinyanByCalendar
);
LuachMinyanRouter.get(
  "/import/count/:category",
  LuachMinyanController.getCountMinyanByCategory
);
LuachMinyanRouter.post("/", LuachMinyanController.post);
LuachMinyanRouter.post(
  "/import",
  LuachMinyanController.postDuplicateMinyanByCategory
);
LuachMinyanRouter.put(
  "/addInactiveDates/:id",
  LuachMinyanController.addInactiveDates
);
LuachMinyanRouter.put(
  "/removeInactiveDates/:id",
  LuachMinyanController.removeInactiveDates
);
LuachMinyanRouter.put(
  "/updateInactiveDate/:id",
  LuachMinyanController.updateInactiveDate
);
LuachMinyanRouter.put("/:id", LuachMinyanController.put);
LuachMinyanRouter.delete("/:id", LuachMinyanController.delete);

export default LuachMinyanRouter;
