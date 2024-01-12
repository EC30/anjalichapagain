import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { Iprojects, Queryprojects } from "../interface/projects";
import * as projectsService from "../services/projects";
import { IassignedProjects } from "../interface/assignedProject";
import * as assignedProjectService from "../services/assignedProject";
import AssignedProjectsModel from "../models/assignedProject";


export async function createprojects(req: any, res: Response, next:NextFunction) {
  try{
    const body: Iprojects = req.body;
    console.log(req.body);
    console.log(req.file);
    const user = req.user;
    // body.image= req.file.path;
    if (req.file) {
      body.image = req.file.path;
    } 
    // console.log(req,req.body,task,user);
    const projectInfo=await projectsService.createprojects(body, user.id);
  
    res.status(HttpStatus.CREATED).json({
      message: "Project created successfully",
      projectInfo,
    });
  }catch(error){
    next(error);
  }

}
export async function uploadFiles(req: any, res: Response){
  console.log(req.body);
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
}

export async function getprojectss(req: any, res: Response) {
  const query = req.query;
  const user = req.user;
  const projectss = await projectsService.getprojects(
    user.id,
    query as unknown as Queryprojects
  );

  res.json(projectss);
}

export async function getprojectsById(req: any, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const projects = await projectsService.getprojectsById(parseInt(id), user.id);

    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function updateprojects(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;
    
    const projects = await projectsService.updateprojects(parseInt(id), user.id, req.body);

    res.json(projects);
    console.log('Updated projects:', projects);
  } catch (error) {
    console.error('Error updating projects:', error);
    next(error);
  }
}
export async function updateprojectsByAssignedUser(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;
    console.log("controller");
    const projects = await projectsService.updateprojectByAssignedUser(parseInt(id), user.id, req.body);

    res.json(projects);
    console.log('Updated projects:', projects);
  } catch (error) {
    console.error('Error updating projects:', error);
    next(error);
  }
}

export async function deleteprojects(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;

    const projects = await projectsService.deleteprojects(parseInt(id), user.id);

    res.json({
      message: "projects deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function assignProjects(req: any, res: Response, next:NextFunction) {
  try{
    const body: IassignedProjects = req.body;
    const user = req.user;
    const projectId =req.params.id;
    await projectsService.assignProjects(projectId, body, user.id);

    res.status(HttpStatus.CREATED).json({
      message: "Project assigned successfully",
    });
  } catch(error){
    next(error);
  }
}

export async function getAssignedProject(req: any, res: Response) {
  console.log("aa");
  const query = req.query;
  const user = req.user;
  console.log(user);
  const projectss = await assignedProjectService.getAssignedprojects
  (
    user.id,
    query as unknown as Queryprojects
    );
  res.json(projectss);
}

export async function updateAssignedProject(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;
    
    const projects = await assignedProjectService.updateAssignedproject(parseInt(id), user.id, req.body);

    res.json(projects);
    console.log('Updated  assign projects:', projects);
  } catch (error) {
    console.error('Error updating  assign projects:', error);
    next(error);
  }
}
export async function deleteAssignedProject(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { id } = req.params;

    const projects = await assignedProjectService.deleteAssignedProject(parseInt(id), user.id);

    res.json({
      message: "Assign project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
