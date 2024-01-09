import BaseModel from "./baseModel";
// import { IassignedProjects } from "../interface/assignedProject";
import {IassignedProjects,QueryAssignedprojects,assignedProjectsFilterQuery} from "../interface/assignedProject";
const TABLE_NAME = 'assigned_projects';

export default class AssignedProjectsModel extends BaseModel {
  static async getAssignedProject(params: assignedProjectsFilterQuery) {
    const query = this.queryBuilder()
      .select({
          id: "t.id",
          projectId: "t.project_id",
          assignedTo: "t.assigned_to",
          createdAt: "t.created_at",
          updatedAt: "t.updated_at",
          updatedBy: "t.updated_by",
          // projectName: "p.name", 
      })
      .from({ t: TABLE_NAME })
      .where({ assignedTo: params.userId })
      // .whereRaw("LOWER(task) like ?", [`%${params.search?.toLowerCase()}%`])
      .leftJoin({ u: "users" }, { "t.assigned_to": "u.id" });

    query.offset(params.offset).limit(params.limit);

    return query;
  }

  static async countAllAssignedProject(params: assignedProjectsFilterQuery) {
    return this.queryBuilder()
      .table(TABLE_NAME)
      .where({ assignedTo: params.userId })
      // .whereRaw("LOWER(name) like ?", [`%${params.search?.toLowerCase()}%`])
      .count({ count: "id" })
      .first();
  }

  static async getAssignedProjectsById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        assignedTo: "assigned_to",
      })
      .from(TABLE_NAME)
      .where({ id, assignedTo: userId })
      .first();
  }

  static async createAssignedProject(assignedProject:any) {
    return this.queryBuilder().insert(assignedProject).table(TABLE_NAME);
}

  static async updateAssignedProject(id:number, assignedProject:any) {
      return this.queryBuilder().update(assignedProject).table(TABLE_NAME).where({ id });
  }

  static async deleteAssignedProject(id:number) {
      return this.queryBuilder().table(TABLE_NAME).where({ id }).del();
  }
}
