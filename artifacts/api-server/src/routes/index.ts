import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cautelasRouter from "./cautelas";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cautelasRouter);

export default router;
