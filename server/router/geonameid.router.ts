import { Router } from "express";
import GeonameidController from "../controllers/geonameid.controller";

const router = Router();

router.route("/")
    .post(GeonameidController.saveGeonameid)
    .get(GeonameidController.getGeonameid);

export default router;
