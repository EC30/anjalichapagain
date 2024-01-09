import { Router } from "express";

import { deleteUser, getById, getAll, updateUser, getUserByUsername } from "../controller/user";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { userSchema, updateUserSchema } from "../schema/user";

const router = Router();

router.get("/", getAll);

router.get("/:id", getById);

router.get("/:username", getUserByUsername);

router.put("/:id", validateReqBody(updateUserSchema), updateUser);

router.delete("/:id", deleteUser);

export default router;
