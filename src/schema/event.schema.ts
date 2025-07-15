import * as z from "zod";

export const createEventSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  dateTime: z
    .string({ error: "Date and time is required" })
    .datetime({ message: "Invalid date format. Use ISO 8601 format" }),
  location: z
    .string({ error: "Location is required" })
    .max(255, { message: "Location must be less than 255 characters" }),
  capacity: z
    .number({ error: "Capacity is required" })
    .int({ message: "Capacity must be an integer" })
    .min(1, { message: "Capacity must be at least 1" })
    .max(1000, { message: "Capacity cannot exceed 1000" }),
});

export const registerUserSchema = z.object({
  userId: z.string({ error: "User ID is required" }),
});

export const createUserSchema = z.object({
  name: z
    .string({ error: "Name is Required" })
    .min(1, { message: "Name cannot be empty" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string({ error: "Email is Required" })
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

export const cancelRegistrationSchema =z.object({
userId: z.string({ error: "User ID is required" })
})