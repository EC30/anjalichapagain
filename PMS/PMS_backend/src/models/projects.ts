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
        priority:"t.priority",
      })
      .from({ t: "projects" })
      .where({ assignedBy: params.userId })
      .where(params.status ? { status: params.status }: true )
      .where((builder) => {
        if (params.search) {
          builder.whereRaw("LOWER(t.name) like ?", [`%${params.search.toLowerCase()}%`]);
        }
      })
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
  // static async countAll(params: projectsFilterQuery) {
  //   return this.queryBuilder()
  //     .table("projects")
  //     .select({assignedBy:"assignedBy"})  // Select the column you want to count by}
  //     .where({ assignedBy: params.userId })
  //     .where(params.status ? { status: params.status } : true)
  //     .where((builder) => {
  //       if (params.search) {
  //         builder.whereRaw("LOWER(t.name) like ?", [`%${params.search.toLowerCase()}%`]);
  //       }
  //     })
  //     .groupBy("assignedBy")  // Group by the assignedBy column
  //     .count({ count: "assignedBy" })
  //     .first();
  // }

  static async getprojectsById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        name: "name",
        status: "status",
        assignedBy: "assigned_by",
        priority:"priority",
        deadline:"deadline",
        description:"description",
        image:"image",
      })
      .from("projects")
      .where({ id, assignedBy: userId })
      .first();
  }
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