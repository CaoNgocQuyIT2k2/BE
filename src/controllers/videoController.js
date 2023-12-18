import initModel from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Sequelize } from "sequelize";
import { responseData } from "../config/response.js";
import { decodeToken } from "../config/JWT.js";
import {  PrismaClient } from "@prisma/client";


let model = initModel(sequelize);
let Op = Sequelize.Op;
let prisma = new PrismaClient();

export {
  getVideo,
  createVideo,
  getVideoId,
  getVideoType,
  getVideoByType,
  getVideoPage,
  getCommentVideo,
  commentVideo,
};

export const searchVideo = async (req,res) => {
  let {videoName} = req.params;
  let data = await prisma.video.findMany({
    where:{
      video_name:{
        contains : videoName
      }
    }
  })
  responseData(res, "Thành công", data, 200);
}


const commentVideo = async (req, res) => {
//   try {
    let { token } = req.headers;
    // giải mã => object giống bên trang jwt.io
    let dToken = decodeToken(token);
    console.log("Decoded Token:", dToken); 
    let { user_id } = dToken.data;
    console.log("🚀 ~ dToken.data;:", dToken.data)
    let { video_id, content } = req.body;

    let newData = {
      user_id,
      video_id,
      content,
      date_created: new Date(),
      reply_list: "",
      timestamp: new Date(),
    };

    await model.video_comment.create(newData);

    responseData(res, "Thành công", { token, user_id, video_id, content }, 200);
//   } catch {
//     responseData(res, "Lỗi...", "", 500);
//   }
};

const getCommentVideo = async (req, res) => {
  try {
    let { videoId } = req.params;
    let data = await model.video_comment.findAll({
      where: {
        video_id: videoId,
      },
      include: ["user"],
      order: [['timestamp', 'DESC']],
    });
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi...", data, 500);
  }
};

const getVideoPage = async (req, res) => {
  try {
    let { page } = req.params;
    let pageSize = 3;
    let index = (page - 1) * pageSize;

    let dataCount = await model.video.count();
    let totalPage = Math.ceil(dataCount / pageSize);

    let data = await model.video.findAll({
      offset: index,
      limit: pageSize,
    });

    // {data, totalPages }
    responseData(res, "Thành công", { data, totalPage }, 200);
  } catch (error) {
    // In lỗi để kiểm tra
    console.error("Lỗi khi lấy trang video:", error);

    responseData(res, "Lỗi...", data, 500);
  }
};

const getVideoByType = async (req, res) => {
  try {
    let { typeId } = req.params;
    let data = await model.video.findAll({
      where: {
        type_id: typeId,
      },
    });
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi...", data, 500);
  }
};

const getVideoType = async (req, res) => {
  try {
    let data = await model.video_type.findAll();
    responseData(res, "Thành công", data, 200);
  } catch (error) {
    responseData(res, "Lỗi...", data, 500);
  }
};

const getVideo = async (req, res) => {
  try {
    // //bất đồng bộ
    // let data = await model.video.findAll({
    //     where: {
    //         video_name: {
    //             [Op.like]: '%gaming%'
    //         }
    //     },
    //     attributes: ["video_id","video_name"]
    // });
    let data = await model.video.findAll();

    responseData(res, "Thành công", data, 200);
  } catch (exception) {
    responseData(res, "Lỗi...", data, 500);
  }
};
const createVideo = (req, res) => {
  res.send("create video");
};

const getVideoId = async (req, res) => {
  try {
    let { videoId } = req.params;
    let dataPK = await model.video.findByPk(videoId);

    let data = await model.video.findOne({
      where: {
        video_id: videoId,
      },
      include: ["user", "type"],
    });
    responseData(res, "Thành công", data, 200);
  } catch {
    responseData(res, "Lỗi...", data, 500);
  }
};

// import mysql from 'mysql2';
// const connect = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     port: "3307",
//     database: "db_youtube"
// });
