import { Router } from "express";
import userRoutes from "./user";
// import assignedProjectRoute from "./assignedProject"
import authRoutes from "./auth";
import projectsRoutes from "./projects";
import { auth } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", auth, projectsRoutes);
// router.use("/aprojects",auth, assignedProjectRoute);;

export default router;
