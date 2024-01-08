import NotFoundError from "../error/notFoundError";
import BadRequestError from "../error/badRequestError";
import { Iprojects, Queryprojects } from "../interface/projects";
import projectsModel from "../models/projects";
import AssignedProjectsModel from "../models/assignedProject";
import { buildMeta, getPaginationOptions } from "../util/pagination";
import { IassignedProjects } from "../interface/assignedProject";

// export async function createprojects(body: Iprojects, userId: number, assignedTo: number[]) {
//   console.log(body);
//   const project = await projectsModel.createprojects({
//     ...body,
//     assigned_by: userId,
//   });
//   // createAssignedProject(assignedTo, project.id)
//   return {
//     message: "project created successfully",
//   };
// }
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

  // projects.task=body.task??projects.task;
  // projects.completed=body.completed??projects.completed;
  // await projectsModel.updateprojects(id, projects);

  return projects;
}



export async function deleteprojects(id: number, userId: number) {
  const projects = projectsModel.getprojectsById(id, userId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }

  await projectsModel.deleteprojects(id);
}

export async function assignProjects(projectId:number, body: IassignedProjects, userId: number) {
  await AssignedProjectsModel.createAssignedProject({
    ...body,
    project_id:projectId,
    updated_by: userId,
  });
  return {
    message: "project assign created successfully",
  };
}