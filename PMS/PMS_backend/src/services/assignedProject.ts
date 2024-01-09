import NotFoundError from "../error/notFoundError";
import BadRequestError from "../error/badRequestError";
import unauthenticatedError from "../error/unauthenticatedError";
import AssignedProjectsModel from "../models/assignedProject";
import { buildMeta, getPaginationOptions } from "../util/pagination";
import {checkOwner, checkAssigned} from "../util/projectUtils";
import {IassignedProjects,QueryAssignedprojects,assignedProjectsFilterQuery} from "../interface/assignedProject";


export async function getAssignedprojects(userId: number, query: QueryAssignedprojects) {
  const { page, size } = query;

  const pageDetails = getPaginationOptions({ page, size });

  const projectss = await AssignedProjectsModel.getAssignedProject({ ...pageDetails, ...query, userId });
  const count = await AssignedProjectsModel.countAllAssignedProject({ ...pageDetails, ...query, userId });

  const total = count.count;

  const meta = buildMeta(total, size, page);

  return {
    data: projectss,
    meta,
  };
}

// export async function updateAssignedproject(id: number, projectId: number, body:any) {
//   const projects: IassignedProjects = await  AssignedProjectsModel.getAssignedProjectById(id, projectId);

//   if (!projects) {
//     throw new NotFoundError(`Project with id ${id} Not Found`);
//   }
//   return projects;
// }



// export async function deleteAssignedProject(id: number, projectId: number) {
//   const projects =  AssignedProjectsModel.getAssignedProjectById(id, projectId);

//   if (!projects) {
//     throw new NotFoundError(`Project with id ${id} Not Found`);
//   }

//   await  AssignedProjectsModel.deleteAssignedProject(id);
// }