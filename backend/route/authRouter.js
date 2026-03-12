import express from "express"
import { register, login, logout } from "../controllers/authController.js";
import userAuth from '../middleware/userAuth'

const authRouter = express.Router();

// กำหนดเส้นทางสำหรับการลงทะเบียนผู้ใช้ โดยใช้ HTTP POST method และเรียกใช้ฟังก์ชัน register จาก authController
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/member", userAuth, getMe);

export default authRouter;