import { Router } from "express";
import multer from "multer";
import {createprojects,getprojectss,getprojectsById,updateprojects,deleteprojects, assignProjects, getAssignedProject, updateAssignedProject, updateprojectsByAssignedUser, getAssignedUsers} from "../controller/projects";
import {validateReqBody} from "../middleware/validator";
import {projectSchema} from "../schema/projects";
import { updateprojectSchema } from "../schema/projects";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  });
const upload = multer({ storage: storage });

const router = Router();

router.post("/", upload.single("image"), validateReqBody(projectSchema), createprojects);
router.get("/", getprojectss);
router.get("/assigned", getAssignedProject );
router.get("/assignedUsers/:id", getAssignedUsers );
router.get("/:id", getprojectsById);
router.put("/:id", upload.single("image"), validateReqBody(updateprojectSchema), updateprojects);
router.put("/assigned/:id", validateReqBody(updateprojectSchema), updateprojectsByAssignedUser);
router.delete("/:id", deleteprojects);
router.post("/:id/assign", assignProjects);
router.put("/:id/assign", updateAssignedProject);

export default router;