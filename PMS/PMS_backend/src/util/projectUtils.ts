import projectsModel from "../models/projects";
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
    ) => {
      try {
          
       
      } catch (error) {
       
      }
    };