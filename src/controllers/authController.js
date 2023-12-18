import { response } from "express";
import initModels from "../models/init-models.js";
import { responseData } from "../config/response.js";
import sequelize from "../models/connect.js";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import {
  checkRefToken,
  checkToken,
  createRefToken,
  createToken,
  decodeToken,
} from "../config/JWT.js";

let model = initModels(sequelize);
export const login = async (req, res) => {
  // try {
  let { email, pass_word } = req.body;
  //check email và password == table user
  let checkUser = await model.users.findOne({
    where: {
      email: email,
    },
  });
  // tồn tại => login thành công
  if (checkUser) {
    if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
      let key = new Date().getTime();
      let token = createToken({
        user_id: checkUser.user_id,
        key,
      });
      // let token = createToken({ tenLop:"hacker", HetHanString:'29/05/2024',HetHanTime:"1716940800000" });
      //khởi tạo refresh token
      let refToken = createRefToken({
        user_id: checkUser.user_id,
        key,
      });
      // lưu refresh token vào tab
      await model.users.update(
        { ...checkUser.dataValues, refresh_token: refToken }, {
          where: {
            user_id: checkUser.user_id,
          },
        });
      responseData(res, "Đăng nhập thành công", token, 200);
    } else {
      responseData(res, "Mật khẩu không đúng", "", 404);
    }
  } else {
    responseData(res, "Email không đúng", "", 404);
  }

  //ko tồn tại => sai email hoặc passs
  // } catch {
  //   responseData(res, "Lỗi...", "", 500);
  // }
};

export const signUp = async (req, res) => {
  try {
    let { full_name, email, pass_word } = req.body;

    let checkUser = await model.users.findOne({
      where: {
        email,
      },
    });

    // check trùng mail:
    if (checkUser) {
      return responseData(res, "Email đã tồn tại", "", 400);
    }

    let newData = {
      full_name: full_name,
      email: email,
      pass_word: bcrypt.hashSync(pass_word, 10),
      avatar: "",
      face_app_id: "",
      role: "user",
    };
    //insert data
    model.users.create(newData);
    responseData(res, "Đăng kí thành công", "", 200);
  } catch (error) {
    responseData(res, "Lỗi...", "", 500);
  }
};

export const loginFacebook = async (req, res) => {
  try {
    let { full_name, faceAppId } = req.body;

    let checkUser = await model.users.findOne({
      where: {
        face_app_id: faceAppId,
      },
    });
    // kiểm tra facebook app id

    // nếu đã tồn tại -> login
    if (!checkUser) {
      // nếu chưa tồn tại -> thêm user -> login
      let newData = {
        full_name: full_name,
        email: "",
        pass_word: "",
        avatar: "",
        face_app_id: faceAppId,
        role: "user",
      };
      //insert data
      await model.users.create(newData);
    }
    responseData(res, "Login thành công", "token", 200);
  } catch {
    responseData(res, "Lỗi...", "", 500);
  }
};

export const tokenRef = async (req, res) => {
  try {
    let { token } = req.headers;

    // Check token
    let check = checkToken(token);
    // Token không hợp lệ
    if (check != null && check.name != "TokenExpiredError") {
      return responseData(res, check.name, "", 401);
    }

    let accessToken = decodeToken(token);

    // Lấy thông tin user trong database
    let getUser = await model.users.findOne({
      where: {
        user_id: accessToken.data.user_id,
      },
    });

    // Check refresh token
    let checkRef = checkRefToken(getUser.refresh_token);
    // Refresh token không hợp lệ
    if (checkRef != null) {
      return responseData(res, checkRef.name, "", 401);
    }

    // Check code
    let refToken = decodeToken(getUser.refresh_token);
    if (accessToken.data.key != refToken.data.key) {
      return responseData(res, "Invalid token", "", 401);
    }

    // Tạo mới access token
    let newToken = createToken({
      user_id: getUser.user_id,
      key: refToken.data.key,
    });

    return responseData(res, "", newToken, 200);
  } catch (error) {
    console.error("Error in tokenRef:", error);
    return responseData(res, "Internal Server Error", "", 500);
  }
};


export const logout = async (req, res) => {
  let { token } = req.headers;
  let accessToken = decodeToken(token);

  // lấy thông tin user trong database
  let getUser = await model.users.findOne({
    where: {
      user_id: accessToken.data.user_id,
    },
  });


  // lấy thông tin user trong db
  await model.users.update(
    {
      ...getUser.dataValues,
      refresh_token: "",
    },
    {
      where: {
        user_id: accessToken.data.user_id,
      },
    }
  );
  responseData(res, "", newToken, 200);
};
