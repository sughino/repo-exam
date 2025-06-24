import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { getDeliveries, getPersonalData, getUser } from "../controllers/getController.js";
import { cacheMiddleware } from "../middelware/cache.js";
const router = Router();

router.get("/user", checkAdmin, cacheMiddleware('user'), getUser);
router.get("/personaldata", cacheMiddleware('personalData'), getPersonalData);
router.get("/deliveries", cacheMiddleware('deliveries'), getDeliveries);

export default router;