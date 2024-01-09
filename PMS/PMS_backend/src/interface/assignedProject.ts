import { PaginationQuery } from "./pagination";
export interface IassignedProjects {
    project_id:number;
    assigned_to: number[];
    updated_by:number;
}
export interface QueryAssignedprojects extends PaginationQuery {
    search?: string;
  }
  
export interface assignedProjectsFilterQuery extends QueryAssignedprojects {
    limit: number;
    offset: number;
    userId: number;
  }