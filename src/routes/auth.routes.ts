import { Router } from "express";
import { createUser } from "../controller/auth.controller";


const router = Router();
router.route("/").post(createUser);



export {router as authRoutes } ;
