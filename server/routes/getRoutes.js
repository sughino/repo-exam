import { Router } from "express";
import { checkAdmin } from "../middelware/checkAdmin.js";
import { getItem, getOtherItem, getUser, getCategory } from "../controllers/getController.js";
import { cacheMiddleware } from "../middelware/cache.js";
const router = Router();

router.get("/user", checkAdmin, cacheMiddleware('user'), getUser);
router.get("/request", cacheMiddleware('item'), getItem);
router.get("/approverequest", checkAdmin, cacheMiddleware('otheritem'), getOtherItem);
router.get("/category", getCategory)

export default router;