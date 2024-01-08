import { Router } from "express";
import userRoutes from "./user";
// import authRoutes from "./auth";
// import cookieRoutes from "./cookie";
import authRoutes from "./auth";
import projectsRoutes from "./projects";
import { auth } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", auth, projectsRoutes);
// router.use("/projects", projectRoutes);
// router.use("/cookie", cookieRoutes);

export default router;
