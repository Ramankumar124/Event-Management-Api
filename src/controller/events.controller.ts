import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { prisma } from "../database/index";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import {
  cancelRegistrationSchema,
  createEventSchema,
  registerUserSchema,
} from "../schema/event.schema";

export const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { capacity, title, dateTime, location } = createEventSchema.parse(
      req.body
    );

    if (new Date(dateTime) < new Date()) {
      return next(new ApiError(400, "Event date cannot be in the past"));
    }

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
            name: true,
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

export const registerEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const { userId } = registerUserSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Find the event with current registrations
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { users: true },
      });

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      // Check if event is in the past
      if (event.dateTime < new Date()) {
        throw new ApiError(400, "Cannot register for past event");
      }

      //  Check if user is already registered
      const alreadyRegistered = event.users.some((user) => user.id === userId);
      if (alreadyRegistered) {
        throw new ApiError(400, "User already registered for this event");
      }

      // Check if event is full
      if (event.users.length >= event.capacity) {
        throw new ApiError(400, "Event is full");
      }

      // check if user exists
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // register the user to the event
      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          users: {
            connect: { id: userId },
          },
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedEvent;
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Successfully registered for event"));
  }
);

export const cancelRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId, userId } = req.params;

    if (!eventId || !userId) {
      return next(new ApiError(400, "Event ID and User ID are required"));
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        users: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });

    if (!event) {
      return next(new ApiError(404, "Event not found"));
    }

    if (event.users.length === 0) {
      return next(new ApiError(400, "User is not registered for this event"));
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedEvent,
          "Registration cancelled successfully"
        )
      );
  }
);

export const getUpcomingEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();
    console.log("Fetching upcoming events, current date:", currentDate);

    const upcomingEvents = await prisma.event.findMany({
      where: {
        dateTime: {
          gt: currentDate,
        },
      },
      orderBy: [{ dateTime: "asc" }, { location: "asc" }],
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          upcomingEvents,
          "Upcoming events retrieved successfully"
        )
      );
  }
);

export const getEventStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!event) {
      return next(new ApiError(404, "Event not found"));
    }

    const totalRegistrations = event._count.users;
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentageUsed = (totalRegistrations / event.capacity) * 100;

    const stats = {
      totalRegistrations,
      remainingCapacity,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      capacity: event.capacity,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Event statistics retrieved successfully")
      );
  }
);
