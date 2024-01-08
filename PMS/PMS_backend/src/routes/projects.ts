import { Router } from "express";

import {createprojects,getprojectss,getprojectsById,updateprojects,deleteprojects} from "../controller/projects";
import {validateReqBody} from "../middleware/validator";
import {projectSchema} from "../schema/projects";
import { updateprojectSchema } from "../schema/projects";

const router = Router();

router.post("/", validateReqBody(projectSchema), createprojects);
// router.post("/", createprojects);

router.get("/", getprojectss);

router.get("/:id", getprojectsById);

router.put("/:id", validateReqBody(updateprojectSchema), updateprojects);

router.delete("/:id", deleteprojects);

export default router;