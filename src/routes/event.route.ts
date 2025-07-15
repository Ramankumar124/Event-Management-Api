import { Router } from "express";
import {
  createEvent,
  getEvent,
  registerEvent,
} from "../controller/events.controller";

const router = Router();
router.route("/").post(createEvent);
router.route("/:id").get(getEvent);
router.route("/:eventId/register").post(registerEvent);
// router.route("/:eventId/register/:userId").delete(cancelRegistration);
// router.route("/upcoming").get(getUpcomingEvent);
// router.route("/:eventId/stats").get(getEventStats);

export {router as eventRoutes } ;
