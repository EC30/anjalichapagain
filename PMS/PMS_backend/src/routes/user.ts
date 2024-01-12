import { Router } from "express";

import { deleteUser, getById, getAll, updateUser, getUserByUsername, getCurrentUsers } from "../controller/user";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { userSchema, updateUserSchema } from "../schema/user";
import {auth} from "../middleware/auth";

const router = Router();

router.get("/", getAll);

router.get("/check", auth, getCurrentUsers);

router.get("/:id", getById);

router.get("/:username", getUserByUsername);

router.put("/:id", validateReqBody(updateUserSchema), updateUser);

router.delete("/:id", deleteUser);

export default router;
