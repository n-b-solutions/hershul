import { Request, Response, NextFunction } from "express";

import GeonameidService from "../services/geonameid.service";

const GeonameidController = {
  saveGeonameid: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { geonameid } = req.body;
      GeonameidService.saveGeonameid(geonameid);
      res.status(200).send({ message: "Geonameid saved successfully" });
    } catch (error) {
      next(error);
    }
  },

  getGeonameid: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const geonameid = GeonameidService.getGeonameid();
      res.status(200).send({ geonameid });
    } catch (error) {
      next(error);
    }
  },
};

export default GeonameidController;
