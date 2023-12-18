import initModels from "../models/init-models.js";
import { responseData } from "../config/response.js";
import sequelize from "../models/connect.js";
import bcrypt from "bcrypt";
import { decodeToken } from "../config/JWT.js";
let model = initModels(sequelize);

export const getUser = async (req, res) => {
  try {
    let data = await model.users.findAll();
    responseData(res, "Thành công", data, 200);
  } catch {
    responseData(res, "lỗi ...", "", 400);
  }
};

export const updateInfo = async (req, res) => {
  try {
    //upload riêng avatar
    // không cho phép user thay đổi email
    let { full_name, pass_word } = req.body;
    let { token } = req.headers;
    let accessToken = decodeToken(token);

    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    getUser.pass_word = bcrypt.hashSync(pass_word, 10);
    getUser.full_name = full_name;

    await model.users.update(getUser.dataValues, {
      where: {
        user_id: accessToken.data.user_id,
      },
    });
    responseData(res, "Update thành công", "", 200);
  } catch {
    responseData(res, "lỗi ...", "", 400);
  }
};

export const getInfo = async (req, res) => {
  //   try {
  let { token } = req.headers;
  let accessToken = decodeToken(token);

  let getUser = await model.users.findOne({
    where: {
      user_id: accessToken.data.user_id,
    },
  });

  if (!getUser) {
    responseData(res, "User không tồn tại", "", 404);
    return;
  }

  responseData(res, "success", getUser, 200);
  //   } catch {
  //     responseData(res, "lỗi ...", "", 500);
  //   }
};

import compress_images from 'compress-images'

export const uploadAvatar = async (req, res) => {
  // try {
    let { file } = req;
    compress_images(
      process.cwd() + "/public/img/" + file.filename, 
      process.cwd() + "/public/video",
      console.log("Đường Dẫn Nguồn:", process.cwd() + "/public/img/" + file.filename),
console.log("Đường Dẫn Đích:", process.cwd() + "/public/video"),

      { compress_force: false, statistic: true, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "10"] } },
      { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
      { svg: { engine: "svgo", command: "--multipass" } },
      {
        gif: {
          engine: "gifsicle",
          command: ["--colors", "64", "--use-col=web"],
        },
      },
      function (error, completed, statistic) {
        console.log("-------------");
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log("-------------");
      }
    );

    let { token } = req.headers;
    let accessToken = decodeToken(token);
    let { user_id } = accessToken.data;
    let getUser = await model.users.findOne({
      where: {
        user_id,
      },
    });
    //   fs.readFile(process.cwd() + "/public/img" + file.filename, (err, data) => {
    //     // let newName = Buffer.from(data).toString("base64");
    //     let newName = `data:${file.mimetype};base64,${Buffer.from(data).toString("base64")}`
    //     res.send(newName);
    //     return;
    //   });
    getUser.avatar = file.filename;
    await model.users.update(getUser.dataValues, {
      where: {
        user_id,
      },
    });
    res.send(file.filename);
    responseData(res, "success", getUser, 200);
    return;
  // } catch {
  //   responseData(res, "lỗi ...", "", 500);
  // }
};
