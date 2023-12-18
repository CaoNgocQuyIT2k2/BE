import express from "express";
import { getInfo, getUser, updateInfo, uploadAvatar } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/get-user", getUser);

//API update info user
userRoute.put("/update-info", updateInfo);

//API get info user
userRoute.get("/get-info", getInfo);

// trả về đường dẫn gốc của source


import upload from "../config/upload.js";
//Fs file system
import fs from "fs";
//API upload avatar
userRoute.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default userRoute;
// mã hóa password
// so sánh dữ liệu thô và dữ liệu mã hóa
