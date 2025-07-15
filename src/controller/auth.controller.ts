import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { createUserSchema } from "../schema/event.schema";
import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = createUserSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return next(new ApiError(400, "User with this email already exists"));
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    if (!newUser) return next(new ApiError(400, "Unable to Create User"));

    res
      .status(201)
      .json(new ApiResponse(201, newUser, "User created successfully"));
  }
);
