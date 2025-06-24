import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { deleteUser, deletePersonalData, deleteDalivery } from "../controllers/deleteController.js";
const router = Router();

router.delete("/user", checkAdmin, deleteUser);
router.delete("/personaldata", deletePersonalData);
router.delete("/delivery", deleteDalivery);

export default router;