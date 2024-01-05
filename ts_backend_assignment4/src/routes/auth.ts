import { Router } from "express";

import { login, refreshToken, signup } from "../controller/auth";
import { userSchema } from "../schema/user";
import { validateReqBody } from "../middleware/validator";
// import { login } from "../controller/auth";

const router = Router();

router.post("/signup", validateReqBody(userSchema), signup);

router.post("/login", validateReqBody(userSchema), login);

router.post("/refresh", refreshToken);

export default router;