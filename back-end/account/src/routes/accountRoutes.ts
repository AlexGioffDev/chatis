import { Router } from "express";
import { createAccount, getProfile, profileExist } from "../controllers/accountControllers.js";


const accountRoutes = Router();

accountRoutes.post("/create", createAccount);
accountRoutes.get("/me", profileExist);
accountRoutes.get("/profile/:accountId", getProfile);

export default accountRoutes;