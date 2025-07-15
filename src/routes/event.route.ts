
import { Router } from "express";

 const router = Router();
router.route("/").post(createEvent);
router.route("/:eventId").get(getEvent);
router.route("/:eventId/register").post(registerEvent);
router.route("/:eventId/register/:userId").delete(cancelRegistration);
router.route("/upcoming").get(getUpcomingEvent);
router.route("/:eventId/stats").get(getEventStats);
