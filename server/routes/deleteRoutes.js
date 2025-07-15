import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { deleteUser, deleteItem } from "../controllers/deleteController.js";
const router = Router();

router.delete("/user", checkAdmin, deleteUser);
router.delete("/request", deleteItem);

export default router;