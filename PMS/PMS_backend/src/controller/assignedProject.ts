import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { IassignedProjects } from "../interface/assignedProject";
import * as assignedProjectService from "../services/assignedProject";


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
