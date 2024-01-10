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

export async function updateprojects(id: number, userId: number, body:Iprojects,isAssignedUser=false) {
  console.log("services3");
  const projects: Iprojects = await projectsModel.getprojectsById(id,userId);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }

  if(isAssignedUser){
    console.log("assignedUser");
    projects.status = body.status;
    await projectsModel.updateprojects(id,projects);
  }else{
    await projectsModel.updateprojects(id,body);
  }
  return projects;
}

export async function updateprojectByAssignedUser(id: number, userId: number, body:Iprojects) {
  console.log("services");
  const checkAssignedUser=await checkAssigned(userId,id);
  console.log(checkAssignedUser);
  if(!checkAssignedUser){
    throw new unauthenticatedError("You cannot update non-assigned project status");
  }
  console.log("services2");
  console.log(checkAssignedUser.updatedBy);
  await updateprojects(id,checkAssignedUser.updatedBy,body,true);

}


export async function deleteprojects(id: number, userId: number) {
  const projects = projectsModel.getprojectsById(id, userId);
  console.log(projects);

  if (!projects) {
    throw new NotFoundError(`Project with id ${id} Not Found`);
  }

  await projectsModel.deleteprojects(id);
}

export async function assignProjects(projectId:number, body: IassignedProjects, userId: string) {
  // console.log(typeof userId);
  // console.log(body.assigned_to[0]);
  if(body.assigned_to.includes(parseInt(userId))){
    const indexToRemove = body.assigned_to.indexOf(parseInt(userId));
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
      body.assigned_to.splice(indexToRemove, 1);
    }
    // throw new unauthenticatedError("Can;t Assign to Yourself");
  }
  const checkAssignedUser=await checkAssigned(parseInt(userId),projectId);
  console.log("checkassigneduser:",checkAssignedUser);
  if(body.assigned_to.includes(checkAssignedUser)){
    throw new unauthenticatedError("you are already assigned to this project");
  }
  const isOwner = await checkOwner(projectId, parseInt(userId));
  if(!isOwner){
    throw new unauthenticatedError("Not Your Project");
  }
  // console.log(body.assigned_to.length);
  try{
    for(let i = 0; i < body.assigned_to.length; i++){
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