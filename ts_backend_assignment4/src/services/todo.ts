import NotFoundError from "../error/notFoundError";
import { ITodo, QueryTodo } from "../interface/todo";
import TodoModel from "../models/todo";
import { buildMeta, getPaginationOptions } from "../util/pagination";

export async function createTodo(task: string, userId: number) {
  const newTodo: ITodo = {
    task,
    createdBy: userId,
  };
  return TodoModel.createTodo(newTodo);
}

export async function getTodos(userId: number, query: QueryTodo) {
  const { page, size } = query;

  const pageDetails = getPaginationOptions({ page, size });

  const todos = await TodoModel.getTodos({ ...pageDetails, ...query, userId });
  const count = await TodoModel.countAll({ ...pageDetails, ...query, userId });

  const total = count.count;

  const meta = buildMeta(total, size, page);

  return {
    data: todos,
    meta,
  };
}

export async function getTodoById(id: number, userId: number) {
  const todo = await TodoModel.getTodoById(id, userId);

  if (!todo) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  }

  return todo;
}

export async function updateTodo(id: number, userId: number, body:any) {
  const todo: ITodo = await TodoModel.getTodoById(id, userId);

  if (!todo) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  }

  todo.task=body.task??todo.task;
  todo.completed=body.completed??todo.completed;
  await TodoModel.updateTodo(id, todo);

  return todo;
}



export async function deleteTodo(id: number, userId: number) {
  const todo = TodoModel.getTodoById(id, userId);

  if (!todo) {
    throw new NotFoundError(`Todo with id ${id} Not Found`);
  }

  await TodoModel.deleteTodo(id);
}