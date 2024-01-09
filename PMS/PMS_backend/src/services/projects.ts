import NotFoundError from "../error/notFoundError";
import unauthenticatedError from "../error/unauthenticatedError";
import BaseError from "../error/baseError";
import BadRequestError from "../error/badRequestError";
import { Iprojects, Queryprojects } from "../interface/projects";
import projectsModel from "../models/projects";
import AssignedProjectsModel from "../models/assignedProject";
import { buildMeta, getPaginationOptions } from "../util/pagination";
import { IassignedProjects } from "../interface/assignedProject";
import {checkOwner, checkAssigned} from "../util/projectUtils";

export async function createprojects(body: Iprojects, userId: number) {
  console.log(body);
  await projectsModel.createprojects({
    ...body,
    assigned_by: userId,
  });
  return {
    message: "project created successfully",
  };
}

export async function getprojects(userId: number, query: Queryprojects) {
  const { page, size } = query;

  const pageDetails = getPaginationOptions({ page, size });

  const projectss = await projectsModel.getprojects({ ...pageDetails, ...query, userId });
  const count = await projectsModel.countAll({ ...pageDetails, ...query, userId });

  const total = count.count;

  const meta = buildMeta(total, size, page);

  return {
    data: projectss,
    meta,
  };
}

export async function getprojectsById(id: number, userId: number) {
  const projects = await projectsModel.getprojectsById(id, userId);

  if (!projects) {
    throw new NotFoundError(`projects with id ${id} Not Found`);
  }

  return projects;
}

export async function updateprojects(id: number, userId: number, body:any) {
  const projects: Iprojects = await projectsModel.getprojectsById(id, userId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }
  return projects;
}



export async function deleteprojects(id: number, userId: number) {
  const projects = projectsModel.getprojectsById(id, userId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }

  await projectsModel.deleteprojects(id);
}

// export async function assignProjects(projectId:number, body: IassignedProjects, userId: number) {
//   const isOwner = await checkOwner(projectId, userId);
//   if(!isOwner){
//     throw new unauthenticatedError("Not Your Project");
//   }
//   console.log(body.assigned_to.length);
//   try{
//     for(let i = 0; i<body.assigned_to.length; i++){
//       await AssignedProjectsModel.createAssignedProject({
//         ...body,
//         assigned_to:body.assigned_to[i],
//         project_id:projectId,
//         updated_by: userId,
//       });
//     }
//   } catch(error){
//     throw new BaseError("Internal Server Error");
//   }
// }
export async function assignProjects(projectId:number, body: IassignedProjects, userId: number) {
  const isOwner = await checkOwner(projectId, userId);
  if(!isOwner){
    throw new unauthenticatedError("Not Your Project");
  }
  console.log(body.assigned_to.length);
  try{
    for(let i = 0; i<body.assigned_to.length; i++){
      await AssignedProjectsModel.createAssignedProject({
        ...body,
        assigned_to:body.assigned_to[i],
        project_id:projectId,
        updated_by: userId,
      });
    }
  } catch(error){
    throw new BaseError("Internal Server Error");
  }
}