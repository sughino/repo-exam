import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { insertUser, insertItem } from "../controllers/insertController.js";
const router = Router();

router.post("/user", checkAdmin, insertUser);
router.post("/request", insertItem);
//router.post("/otheritem", insertDeliveries);

export default router;