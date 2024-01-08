import { Router } from "express";

import {createAssignedprojects,getAssignedProject,updateAssignedProjects,deleteAssignedProject} from "../controller/assignedProject";
import {validateReqBody} from "../middleware/validator";
import {projectSchema} from "../schema/projects";
import { updateprojectSchema } from "../schema/projects";

const router = Router();

router.post("/", createAssignedprojects);

router.get("/", getAssignedProject);

router.put("/:id", updateAssignedProjects);

router.delete("/:id", deleteAssignedProject);

export default router;