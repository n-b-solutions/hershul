import { Request, Response, NextFunction } from "express";
import LuachMinyanService from "../services/luach-minyan.service";
import { eDateType } from "../../lib/types/minyan.type";

const LuachMinyanController = {
  get: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await LuachMinyanService.get();
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getCalendar: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const date = new Date(req.params.date || new Date());
      const result = await LuachMinyanService.getCalendar(date);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getByDateType: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { dateType } = req.query;

      if (
        !dateType ||
        !Object.values(eDateType).includes(dateType as eDateType)
      ) {
        res.status(400).json({ error: "Invalid or missing dateType" });
        return;
      }

      const result = await LuachMinyanService.getByDateType(
        dateType as eDateType
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await LuachMinyanService.getById(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getCountMinyanByCalendar: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { selectedDate } = req.params;
      const result = await LuachMinyanService.getCountMinyanByCalendar(
        new Date(selectedDate || Date.now())
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getCountMinyanByCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { category } = req.params;

      if (
        !category ||
        !Object.values(eDateType).includes(category as eDateType)
      ) {
        res.status(400).json({ error: "Invalid or missing category" });
        return;
      }

      const result = await LuachMinyanService.getCountMinyanByCategory(
        category as eDateType
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  post: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await LuachMinyanService.post(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  postDuplicateMinyanByCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { currentDateType, selectedDate, currentSelectedDate, dateType } =
        req.body;
      const result = await LuachMinyanService.postDuplicateMinyanByCategory(
        dateType,
        currentDateType,
        selectedDate,
        currentSelectedDate
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  addInactiveDates: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const inactiveDate = req.body;
      const { id } = req.params;
      const result = await LuachMinyanService.addInactiveDates(
        inactiveDate,
        id
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  removeInactiveDates: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { date } = req.body;
      const { id } = req.params;
      const result = await LuachMinyanService.removeInactiveDates(date, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  updateInactiveDate: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { date, isRoutine } = req.body;
      const { id } = req.params;
      const result = await LuachMinyanService.updateInactiveDate(
        date,
        isRoutine,
        id
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  put: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { field, value, internalField } = req.body;
      const { id } = req.params;
      const result = await LuachMinyanService.put(
        field,
        internalField,
        value,
        id
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await LuachMinyanService.delete(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};

export default LuachMinyanController;
