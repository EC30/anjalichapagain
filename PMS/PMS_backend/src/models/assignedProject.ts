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
          projectName: "p.name",
          image:"p.image",
          priority:"p.priority",
          projectDesc:"p.description",
          projectStatus:"p.status",
          deadline:"p.deadline"
      })
      .from({ t: TABLE_NAME })
      .where({ assignedTo: params.userId })
      .leftJoin({ u: "users" }, { "t.assigned_to": "u.id" })
      .leftJoin({ p: "projects" }, { "t.project_id": "p.id" });;

    query.offset(params.offset).limit(params.limit);

    return query;
  }

  static async getAssignedProjectByProjectId(userId:number, projectId:number) {
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
      .where({ assignedTo: userId, projectId:projectId})
      .first();

    return query;
  }

  static async getAssignedUsersByProjectId(userId:number, projectId:number) {
    const query = this.queryBuilder()
      .select({
          id: "t.id",
          assignedTo: "t.assigned_to",
          // projectName: "p.name", 
      })
      .from({ t: TABLE_NAME })
      .where({ assignedBy: userId, projectId:projectId});

    return query;
  }

  static async countAllAssignedProject(params: assignedProjectsFilterQuery) {
    return this.queryBuilder()
      .table(TABLE_NAME)
      .where({ assignedTo: params.userId })
      .count({ count: "id" })
      .first();
  }

  static async getAssignedProjectsById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        assignedTo: "assigned_to",
        updatedBy: "updated_by"
      })
      .from(TABLE_NAME)
      .where({ id, updatedBy: userId })
      .first();
  }

  static async getprojectsAssignedTo(projectId: number, userId: number) {
    const result = await this.queryBuilder()
      .select({
        assignedTo: 'assigned_to',
      })
      .from({ TABLE_NAME })
      .where({ 'project_id': projectId, 'updated_by': userId });

      // const assignedToArray = [];

      // result.forEach(element => {
      //   assignedToArray.push(element.assignedTo);
      // });
      // console.log(result[0].assignedTo);
      const assignedToArray = result.map(row => parseInt(row.assignedTo));
      // console.log(assignedToArray);
      // console.log(assignedToArray);
      return assignedToArray;
   
  }

  static async createAssignedProject(assignedProject:any) {
    return this.queryBuilder().insert(assignedProject).table(TABLE_NAME);
}

  static async updateAssignedProject(id:number, assignedProject:any) {
      return this.queryBuilder().update(assignedProject).table(TABLE_NAME).where({ id });
  }

  static async deleteAssignedProject(projectId:number, userId:number) {
      return this.queryBuilder().table(TABLE_NAME)
      .where({ 
        'project_id': projectId, 'assigned_to': userId, 
       }).del();
  }
}
