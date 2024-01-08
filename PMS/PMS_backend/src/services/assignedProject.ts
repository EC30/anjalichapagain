import NotFoundError from "../error/notFoundError";
import BadRequestError from "../error/badRequestError";
import {IassignedProjects} from "../interface/assignedProject";
import AssignedProjectsModel from "../models/assignedProject";
import { buildMeta, getPaginationOptions } from "../util/pagination";

export async function createAssignedprojects(body: IassignedProjects, projectId: number) {
  console.log(body);
  
  await AssignedProjectsModel.createAssignedProject({
    ...body,
    project_id: projectId,
  });
  return {
    message: "project created successfully",
  };
}

export async function getAssignedprojects() {

  const projectss = await  AssignedProjectsModel.getAssignedProject();

  return {
    data: projectss,
  };
}

export async function updateAssignedproject(id: number, projectId: number, body:any) {
  const projects: IassignedProjects = await  AssignedProjectsModel.getAssignedProjectById(id, projectId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }
  return projects;
}



export async function deleteAssignedProject(id: number, projectId: number) {
  const projects =  AssignedProjectsModel.getAssignedProjectById(id, projectId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }

  await  AssignedProjectsModel.deleteAssignedProject(id);
}