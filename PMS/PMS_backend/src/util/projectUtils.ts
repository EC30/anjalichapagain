import projectsModel from "../models/projects";
import AssignedProjectsModel from "../models/assignedProject";
import NotFoundError from "../error/notFoundError";
import { NextFunction, Request, Response } from "express";
export const checkOwner = async (
  projectId:number,
  userId:number,
  ) => {
    try {
      const projects = await projectsModel.getprojectsById(projectId, userId);
      if (!projects) {
        // throw new NotFoundError(`projects with id ${projectId} Not Found`);
        return false;
      }
      return true;  
    } catch (error) {

    return false;
    }
};

export const checkAssigned = async (
    userId:number,
    projectId:number,
    ) => {
      try {
        console.log('utils');
        const assignedUser=await AssignedProjectsModel.getAssignedProjectByProjectId(userId,projectId);
        console.log(assignedUser);
        console.log(typeof userId);
        console.log(typeof projectId);
        if(!assignedUser){
          return false;
        }
        console.log(assignedUser);
        return assignedUser;
      } catch (error) {
        return false;
      }
};

export const checkAssignedUser = async (
  userId:number,
  projectId:number,
  ) => {
    try {
      console.log('utils');
      const assignedUser=await AssignedProjectsModel.getAssignedProjectByProjectId(userId,projectId);
      console.log(assignedUser);
      console.log(typeof userId);
      console.log(typeof projectId);
      if(!assignedUser){
        return false;
      }
      console.log(assignedUser);
      return assignedUser;
    } catch (error) {
      return false;
    }
};

