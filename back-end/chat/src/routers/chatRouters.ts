import { Router } from "express";
import { createChat, getChatMessages, getMyChats, } from "../controllers/chatControllers.js";


const chatRouter = Router();

chatRouter.post("/create", createChat);
chatRouter.get("/my-chats", getMyChats);
chatRouter.get("/:chatId/messages", getChatMessages)


export default chatRouter;