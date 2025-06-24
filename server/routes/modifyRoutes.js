import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { modifyUser, modifyPersonalData, modifyDelivery } from "../controllers/modifyController.js";
const router = Router();

router.put("/user", checkAdmin, modifyUser);
router.put("/personaldata", modifyPersonalData);
router.put("/delivery", modifyDelivery);

export default router;