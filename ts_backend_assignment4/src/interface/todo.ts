import { PaginationQuery } from "./pagination";

export interface ITodo {
  task: string;
  completed?: boolean;
  createdBy: number;
}

export interface QueryTodo extends PaginationQuery {
  search?: string;
  completed?: boolean;
}

export interface TodoFilterQuery extends QueryTodo {
  limit: number;
  offset: number;
  userId: number;
}