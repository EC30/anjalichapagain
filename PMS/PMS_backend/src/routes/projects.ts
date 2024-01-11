import { Router } from "express";
import multer from "multer";
import {createprojects,getprojectss,getprojectsById,updateprojects,deleteprojects, assignProjects, getAssignedProject, updateAssignedProject, updateprojectsByAssignedUser, uploadFiles} from "../controller/projects";
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
// router.post("/", createprojects);
router.get("/", getprojectss);
router.get("/assigned", getAssignedProject );
// router.post("/upload_files", upload.single("image"), uploadFiles);

router.get("/:id", getprojectsById);
router.put("/:id", validateReqBody(updateprojectSchema), updateprojects);
router.put("/assigned/:id", validateReqBody(updateprojectSchema), updateprojectsByAssignedUser);
router.delete("/:id", deleteprojects);
router.post("/:id/assign", assignProjects);
router.put("/assign/projects/:id", updateAssignedProject);

export default router;