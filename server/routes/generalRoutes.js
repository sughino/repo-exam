import { Router } from "express";
import { getDelivery } from "../controllers/searchController.js";
const router = Router();

router.get("/searchdelivery", getDelivery);

export default router;