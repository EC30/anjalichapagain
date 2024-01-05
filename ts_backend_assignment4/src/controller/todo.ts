import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import * as todoService from "../services/todo";
import { QueryTodo } from "../interface/todo";

export async function createTodo(req: any, res: Response) {
  const { task } = req.body;
  const user = req.user;
  // console.log(req,req.body,task,user);

  await todoService.createTodo(task, user.id);

  res.status(HttpStatus.CREATED).json({
    message: "Todo created successfully",
  });
}

export async function getTodos(req: any, res: Response) {
  const query = req.query;
  const user = req.user;
  const todos = await todoService.getTodos(
    user.id,
    query as unknown as QueryTodo
  );

  res.json(todos);
}

export async function getTodoById(req: any, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const todo = await todoService.getTodoById(parseInt(id), user.id);

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;
    

    const todo = await todoService.updateTodo(parseInt(id), user.id, req.body);

    res.json(todo);
    console.log('Updated Todo:', todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    next(error);
  }
}

export async function deleteTodo(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;

    const todo = await todoService.deleteTodo(parseInt(id), user.id);

    res.json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}