import { Request, Response, NextFunction } from "express";
import { eDateType } from "../../lib/types/minyan.type";
import MinyanService from "../services/minyan.service";

const MinyanController = {
  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await MinyanService.get();
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getCalendar: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = new Date(req.params.date || new Date());
      const result = await MinyanService.getCalendar(date);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getByDateType: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dateType } = req.query;
      const result = await MinyanService.getByDateType(dateType as eDateType);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await MinyanService.getById(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getCountMinyanByCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.params;
      const result = await MinyanService.getCountMinyanByCategory(category as eDateType);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
  getCountMinyanByCalendar: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { selectedDate } = req.params;
    const result = await MinyanService.getCountMinyanByCalendar(new Date(selectedDate || Date.now()));
    res.send(result);
  } catch (error) {
    next(error);
  }
},

  post: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await MinyanService.post(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  postDuplicateMinyanByCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.params;
      const { currentDateType } = req.body;
      const result = await MinyanService.postDuplicateMinyanByCategory(category as eDateType, currentDateType);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  addInactiveDates: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inactiveDate = req.body;
      const { id } = req.params;
      const result = await MinyanService.addInactiveDates(inactiveDate, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  removeInactiveDates: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date } = req.body;
      const { id } = req.params;
      const result = await MinyanService.removeInactiveDates(date, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  updateInactiveDate: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date, isRoutine } = req.body;
      const { id } = req.params;
      const result = await MinyanService.updateInactiveDate(date, isRoutine, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  put: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { field, value, internalField } = req.body;
      const { id } = req.params;
      const result = await MinyanService.put(field, internalField, value, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await MinyanService.delete(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};

export default MinyanController;