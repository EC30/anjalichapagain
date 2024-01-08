import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { Iprojects, Queryprojects } from "../interface/projects";
import * as projectsService from "../services/projects";
import { IassignedProjects } from "../interface/assignedProject";


export async function createprojects(req: any, res: Response) {
  const body: Iprojects = req.body;
  const user = req.user;
  // console.log(req,req.body,task,user);
  await projectsService.createprojects(body, user.id);

  res.status(HttpStatus.CREATED).json({
    message: "Project created successfully",
  });
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

export async function assignProjects(req: any, res: Response) {
  const body: IassignedProjects = req.body;
  const user = req.user;
  const projectId =req.params.id;
  await projectsService.assignProjects(projectId, body, user.id);

  res.status(HttpStatus.CREATED).json({
    message: "Project created successfully",
  });
}