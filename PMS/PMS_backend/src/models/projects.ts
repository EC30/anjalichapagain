import { Iprojects, Queryprojects, projectsFilterQuery } from "../interface/projects";
import BaseModel from "./baseModel";

export default class projectsModel extends BaseModel {
  static async getprojects(params: projectsFilterQuery) {
    const query = this.queryBuilder()
      .select({
        id: "t.id",
        name: "t.name",
        description:"t.description",
        deadline:"t.deadline",
        status: "t.status",
        image:"t.image",
        assignedBy: "t.assigned_by",
        username: "u.username",
      })
      .from({ t: "projects" })
      .where({ assignedBy: params.userId })
      .where(params.status ? { status: params.status }: true )
      // .whereRaw("LOWER(task) like ?", [`%${params.search?.toLowerCase()}%`])
      .leftJoin({ u: "users" }, { "t.assigned_by": "u.id" });

    query.offset(params.offset).limit(params.limit);

    return query;
  }

  static async countAll(params: projectsFilterQuery) {
    return this.queryBuilder()
      .table("projects")
      .where({ assignedBy: params.userId })
      .where(params.status ? { status: params.status } : true)
      .whereRaw("LOWER(name) like ?", [`%${params.search?.toLowerCase()}%`])
      .count({ count: "id" })
      .first();
  }

  static async getprojectsById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        name: "name",
        status: "status",
        assignedBy: "assigned_by",
      })
      .from("projects")
      .where({ id, assignedBy: userId })
      .first();
  }

  // static async getprojectsByProjectName(name: string) {
  //   const project= await this.queryBuilder()
  //     .select({
  //       id: "id",
  //       name: "name",
  //       status: "status",
  //     })
  //     .from("projects")
  //     .where({name})

  //   return project?.[0];
  // }
  static async getprojectsByProjectName(name: string) {
    try {
      const project = await this.queryBuilder()
        .select({
          id: "id",
          name: "name",
          status: "status",
        })
        .from("projects")
        .where({ name });
  
      return project?.[0];
    } catch (error) {
      console.error("Error in getprojectsByProjectName:", error);
      throw error;
    }
  }

  // static async getprojectsAssignedTo(id: number, userId: number) {
  //   const result = await this.queryBuilder()
  //     .select({
  //       id: 'p.id',
  //       name: 'p.name',
  //       status: 'p.status',
  //       assignedBy: 'p.assigned_by',
  //       assignedTo: 'u.assigned_to',
  //     })
  //     .from({ p: 'projects' })
  //     .where({ 'p.id': id, 'p.assigned_by': userId })
  //     .innerJoin({ u: 'assigned_projects' }, 'u.project_id', 'p.id');

  //     const assignedToArray = result.map((row) => row.assigned_to);
  //     console.log(assignedToArray);
  //     console.log(result);
  //     return assignedToArray;
   
  // }

  static async createprojects(projects: Iprojects) {
    return this.queryBuilder().returning("id").insert(projects).table("projects");
  }

  static async updateprojects(id: number, projects: Iprojects) {
    return this.queryBuilder().update(projects).table("projects").where({ id });
  }

  static async deleteprojects(id: number) {
    return this.queryBuilder().table("projects").where({ id }).del();
  }
}