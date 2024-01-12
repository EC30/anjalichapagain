import { Router } from "express";

import { login, refreshToken, signup } from "../controller/auth";
import { userSchema } from "../schema/user";
import {auth} from "../middleware/auth";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
// import { login } from "../controller/auth";

const router = Router();

router.post("/signup", validateReqBody(userSchema), signup);

router.post("/login", login);

router.post("/refresh", refreshToken);

// router.post("/check", auth, getCurrentUsers);

// router.post("/check", auth);

export default router;