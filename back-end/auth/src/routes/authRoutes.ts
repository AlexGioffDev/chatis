import { Router } from "express";
import { loginUser, register, verifyToken } from "../controllers/authController.js";


const authRouter = Router();


authRouter.post("/sign-up", register);
authRouter.post("/sign-in", loginUser);
authRouter.get("/verify", verifyToken);


export default authRouter;