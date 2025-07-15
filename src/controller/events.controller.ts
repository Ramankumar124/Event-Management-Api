import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import {prisma} from "../database/index";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


export const createEvent=asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {}=creteEventSchema.parse(req.body);
  }
)