import { PaginationQuery } from "./pagination";

export interface Iprojects {
  name: string;
  description:string;
  deadline:Date;
  image:string;
  assigned_by: number;
  priority: 'High' | 'Medium' | 'Low';
  status?: boolean;
}

export interface Queryprojects extends PaginationQuery {
  search?: string;
  status?: boolean;
}

export interface projectsFilterQuery extends Queryprojects {
  limit: number;
  offset: number;
  userId: number;
}