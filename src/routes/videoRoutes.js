import express from 'express';
import { getVideo,getVideoId, createVideo,getVideoType,getVideoByType, getVideoPage ,getCommentVideo,commentVideo,searchVideo} from '../controllers/videoController.js';
import { verifyToken } from '../config/JWT.js';

const videoRoute = express.Router();

//Api get video prisma
videoRoute.get("/search-video/:videoName", searchVideo)

//lấy video
videoRoute.get("/get-video", getVideo);
// tạo video
videoRoute.post("/create-video", createVideo);
// lấy video theo ID
videoRoute.get("/get-video-id/:videoId", getVideoId);


//API lấy video theo kiểu video
videoRoute.get("/get-video-type", getVideoType);

//API lấy video theo id của kiểu video
videoRoute.get("/get-video-by-type/:typeId", getVideoByType);

// API lấy video theo trang
videoRoute.get("/get-video-page/:page",verifyToken, getVideoPage);

//API lấy tất cả commnet trong từng video theo id của video
videoRoute.get("/get-comment-video/:videoId", getCommentVideo);

// API thực hiện chức năng comment vào video 
videoRoute.post("/comment-video", commentVideo);


export default videoRoute;
