import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { prisma } from "../database/index";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { createEventSchema } from "../schema/event.schema";

export const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { capacity, title, dateTime, location } = createEventSchema.parse(
      req.body
    );

    const newEvent = await prisma.event.create({
      data: {
        title,
        capacity,
        dateTime,
        location,
      },
    });

    if (!newEvent) return next(new ApiError(400, "Unable to Create Event"));

    const eventId = newEvent?.id;
    res
      .status(200)
      .json(new ApiResponse(201, eventId, "Event created successfully"));
  }
);

export const getEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new ApiError(400, "Event ID is required"));
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          select: {
            id: true,
            Name: true,
            email: true,
          },
        },
      },
    });

    if (!event) return next(new ApiError(404, "Event not found"));

    res
      .status(200)
      .json(new ApiResponse(200, event, "Event retrieved successfully"));
  }
);
