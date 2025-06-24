import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { insertUser, insertPersonalData, insertDeliveries } from "../controllers/insertController.js";
const router = Router();

router.post("/user", checkAdmin, insertUser);
router.post("/personaldata", insertPersonalData);
router.post("/deliveries", insertDeliveries);

export default router;