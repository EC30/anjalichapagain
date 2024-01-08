import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { IassignedProjects } from "../interface/assignedProject";
import * as assignedProjectService from "../services/assignedProject";


export async function createAssignedprojects(req: any, res: Response) {
  const body: IassignedProjects = req.body;
  const user = req.user;
  const project=req.project;
  // console.log(req,req.body,task,user);
  await assignedProjectService.createAssignedprojects(body, project.id);

  res.status(HttpStatus.CREATED).json({
    message: "Project assigned successfully",
  });
}

export async function getAssignedProject(req: any, res: Response) {
  const query = req.query;
  const projectss = await assignedProjectService.getAssignedprojects();
  res.json(projectss);
}

// export async function getprojectsById(req: any, res: Response, next: NextFunction) {
//   try {
//     const project = req.project;
//     const { id } = req.params;

//     const projects = await assignedProjectService.getAssignedprojects(parseInt(id), user.id);

//     res.json(projects);
//   } catch (error) {
//     next(error);
//   }
// }

export async function updateAssignedProjects(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const project = req.project;
    const { id } = req.params;
    
    const projects = await assignedProjectService.updateAssignedproject(parseInt(id), project.id, req.body);

    res.json(projects);
    console.log('Updated projects:', projects);
  } catch (error) {
    console.error('Error updating projects:', error);
    next(error);
  }
}

export async function deleteAssignedProject(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const project = req.project;
    const { id } = req.params;

    const projects = await assignedProjectService.deleteAssignedProject(parseInt(id), project.id);

    res.json({
      message: "projects deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}