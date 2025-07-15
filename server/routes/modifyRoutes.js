import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { modifyUser, modifyItem, modifyOtherItem } from "../controllers/modifyController.js";
const router = Router();

router.put("/user", checkAdmin, modifyUser);
router.put("/request", modifyItem);
router.put("/approverequest", modifyOtherItem);

export default router;