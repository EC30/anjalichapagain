import { Router } from "express";

import {createTodo,getTodos,getTodoById,updateTodo,deleteTodo} from "../controller/todo";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { getCreateTaskSchema, getTaskQuerySchema } from "../schema/todo";

const router = Router();

router.post("/", validateReqBody(getCreateTaskSchema), createTodo);
// router.post("/", createTodo);

router.get("/", validateReqQuery(getTaskQuerySchema), getTodos);

router.get("/:id", getTodoById);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;