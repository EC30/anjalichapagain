import BaseModel from "./baseModel";
import { IassignedProjects } from "../interface/assignedProject";

const TABLE_NAME = 'assigned_projects';

export default class AssignedProjectsModel extends BaseModel {
//   static async getAssignedProjects(params) {
//     try {
//       const query = this.queryBuilder()
//         .select({
//           id: "t.id",
//           projectId: "t.project_id",
//           assignedTo: "t.assigned_to",
//           createdAt: "t.created_at",
//           updatedAt: "t.updated_at",
//           updatedBy: "t.updated_by",
//           projectName: "p.name", 
//           assignedToUsername: "u.username", 
//           updatedByUsername: "ub.username", 
//         })
//         .from({ t: TABLE_NAME })
//         .where(params.projectId ? { project_id: params.projectId } : true)
//         .where(params.assignedTo ? { assigned_to: params.assignedTo } : true)
//         .leftJoin({ p: "projects" }, { "t.project_id": "p.id" })
//         .leftJoin({ u: "users" }, { "t.assigned_to": "u.id" })
//         .leftJoin({ ub: "users" }, { "t.updated_by": "ub.id" });

//       query.offset(params.offset).limit(params.limit);

//       return query;
//     } catch (error) {
//       console.error("Error in getAssignedProjects:", error);
//       throw error;
//     }
//   }

  static async getAssignedProject() {
    return this.queryBuilder()
      .select({
        id: "t.id",
        projectId: "t.project_id",
        assignedTo: "t.assigned_to",
        createdAt: "t.created_at",
        updatedAt: "t.updated_at",
        updatedBy: "t.updated_by",
        projectName: "p.name", 
      })
      .from({ t: TABLE_NAME })
      .leftJoin({ p: "projects" }, { "t.project_id": "p.id" })
      .leftJoin({ u: "users" }, { "t.assigned_to": "u.id" })
      .leftJoin({ ub: "users" }, { "t.updated_by": "ub.id" });
  }

  static async getAssignedProjectById(id: number, projectId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        projectId: "project_id",
        assignedTo: "assigned_to",
      })
      .from(TABLE_NAME)
      .where({ id, projectId: projectId })
      .first();
  }


//   static async countAll(params) {
//     try {
//       return this.queryBuilder()
//         .table(TABLE_NAME)
//         .where(params.projectId ? { project_id: params.projectId } : true)
//         .where(params.assignedTo ? { assigned_to: params.assignedTo } : true)
//         .count({ count: "id" })
//         .first();
//     } catch (error) {
//       console.error("Error in countAll:", error);
//       throw error;
//     }
//   }
  static async createAssignedProject(assignedProject:IassignedProjects) {
      return this.queryBuilder().insert(assignedProject).table(TABLE_NAME);
  }

  static async updateAssignedProject(id:number, assignedProject:IassignedProjects) {
      return this.queryBuilder().update(assignedProject).table(TABLE_NAME).where({ id });
  }

  static async deleteAssignedProject(id:number) {
      return this.queryBuilder().table(TABLE_NAME).where({ id }).del();
  }
}
