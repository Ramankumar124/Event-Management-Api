import { Router } from "express";
import {
  cancelRegistration,
  createEvent,
  getEvent,
  getEventStats,
  getUpcomingEvents,
  registerEvent,
} from "../controller/events.controller";

const router = Router();
router.route("/").post(createEvent);
router.route("/upcoming").get(getUpcomingEvents);
router.route("/:id").get(getEvent);
router.route("/:eventId/register").post(registerEvent);
router.route("/:eventId/register/:userId").delete(cancelRegistration);
router.route("/:eventId/stats").get(getEventStats);

export { router as eventRoutes };
