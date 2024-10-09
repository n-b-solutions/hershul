import { Request, Response } from "express";

import { eDateType } from "../../lib/types/minyan.type";
import MinyanService from "../services/minyan.service";

const MinyanController = {
  get: async (req: Request, res: Response): Promise<void> => {
    const result = await MinyanService.get();
    res.send(result);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await MinyanService.getById(id);
    res.send(result);
  },

  getByDateType: async (req: Request, res: Response): Promise<void> => {
    const { dateType } = req.query;
    const result = await MinyanService.getByDateType(dateType as eDateType);
    res.send(result);
  },

  getCountMinyanByCategory: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { category } = req.params;
    const result = await MinyanService.getCountMinyanByCategory(
      category as eDateType
    );
    res.send(result);
  },

  post: async (req: Request, res: Response): Promise<void> => {
    const result = await MinyanService.post(req.body);
    res.send(result);
  },

  postDuplicateMinyanByCategory: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { category } = req.params;
    const { currentDateType } = req.body;
    const result = await MinyanService.postDuplicateMinyanByCategory(
      category as eDateType,
      currentDateType
    );
    res.send(result);
  },

  put: async (req: Request, res: Response): Promise<void> => {
    const { field, value, internalField } = req.body;
    const { id } = req.params;
    const result = await MinyanService.put(field, internalField, value, id);
    res.send(result);
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await MinyanService.delete(id);
    res.send(result);
  },
};

export default MinyanController;
