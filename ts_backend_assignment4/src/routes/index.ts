import { Router } from "express";
import userRoutes from "./user";
// import authRoutes from "./auth";
// import cookieRoutes from "./cookie";
import authRoutes from "./auth";
import todoRoutes from "./todo";
import { auth } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/todos", auth, todoRoutes);
// router.use("/projects", projectRoutes);
// router.use("/cookie", cookieRoutes);

export default router;
