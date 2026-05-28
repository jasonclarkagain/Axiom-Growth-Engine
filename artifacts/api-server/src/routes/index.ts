import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import plannerRouter from "./planner";
import testimonialsRouter from "./testimonials";
import caseStudiesRouter from "./caseStudies";
import servicesRouter from "./services";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(plannerRouter);
router.use(testimonialsRouter);
router.use(caseStudiesRouter);
router.use(servicesRouter);
router.use(statsRouter);

export default router;
