import express from "express"
import getMsgsForConversation from "../controller/msg.controller.js";


const router = express.Router();


router.get('/', getMsgsForConversation);


export default router;