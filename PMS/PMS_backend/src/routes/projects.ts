import { Router } from "express";

import {createprojects,getprojectss,getprojectsById,updateprojects,deleteprojects, assignProjects, getAssignedProject, updateAssignedProject, updateprojectsByAssignedUser} from "../controller/projects";
import {validateReqBody} from "../middleware/validator";
import {projectSchema} from "../schema/projects";
import { updateprojectSchema } from "../schema/projects";

const router = Router();

router.post("/", validateReqBody(projectSchema), createprojects);
// router.post("/", createprojects);
router.get("/", getprojectss);
router.get("/assigned", getAssignedProject );
router.get("/:id", getprojectsById);
router.put("/:id", validateReqBody(updateprojectSchema), updateprojects);
router.put("/assigned/:id", validateReqBody(updateprojectSchema), updateprojectsByAssignedUser);
router.delete("/:id", deleteprojects);
router.post("/:id/assign", assignProjects);
router.put("/assign/projects/:id", updateAssignedProject);

export default router;