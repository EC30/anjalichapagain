import { ITodo, QueryTodo, TodoFilterQuery } from "../interface/todo";
import BaseModel from "./baseModel";

export default class TodoModel extends BaseModel {
  static async getTodos(params: TodoFilterQuery) {
    const query = this.queryBuilder()
      .select({
        id: "t.id",
        task: "task",
        completed: "completed",
        createdBy: "created_by",
        username: "u.username",
      })
      .from({ t: "tasks" })
      .where({ createdBy: params.userId })
      .where(params.completed ? { completed: params.completed }: true )
      // .whereRaw("LOWER(task) like ?", [`%${params.search?.toLowerCase()}%`])
      .leftJoin({ u: "users" }, { "t.created_by": "u.id" });

    query.offset(params.offset).limit(params.limit);

    return query;
  }

  static async countAll(params: TodoFilterQuery) {
    return this.queryBuilder()
      .table("tasks")
      .where({ createdBy: params.userId })
      .where(params.completed ? { completed: params.completed } : true)
      .whereRaw("LOWER(task) like ?", [`%${params.search?.toLowerCase()}%`])
      .count({ count: "id" })
      .first();
  }

  static async getTodoById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        task: "task",
        completed: "completed",
        createdBy: "created_by",
      })
      .from("tasks")
      .where({ id, createdBy: userId })
      .first();
  }

  static async createTodo(todo: ITodo) {
    return this.queryBuilder().insert(todo).table("tasks");
  }

  static async updateTodo(id: number, todo: ITodo) {
    return this.queryBuilder().update(todo).table("tasks").where({ id });
  }

  static async deleteTodo(id: number) {
    return this.queryBuilder().table("tasks").where({ id }).del();
  }
}