import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import projectsRoutes from "./projects";
import { auth } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", auth, projectsRoutes);


export default router;
