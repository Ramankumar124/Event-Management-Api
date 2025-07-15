import * as z from "zod"
export const createEventSchema = z.object({
    title: z.string({required_error: "Title is required"}).max(200, {message: "Title must be less than 200 characters"}),
    dateTime: z.date({required_error: "Date and time is required"}),
    location: z.string({required_error: "Location is required"}).max(255, {message: "Location must be less than 255 characters"}),
    capacity: z.number({required_error: "Capacity is required"}).int({message: "Capacity must be an integer"}).min(1, {message: "Capacity must be at least 1"}).max(1000, {message: "Capacity cannot exceed 1000"}),
    createdAt: z.date().optional()
})
