//yarn add jsonwebtoken//
//1. mã hóa dữ liệu
//2. kiểm tra token hợp lệ
//3. giải token
import jwt, { decode } from "jsonwebtoken";

export const createToken = (data) => {
  let token = jwt.sign({ data }, "BIMAT", {
    algorithm: "HS256",
    expiresIn: "3s",
  });
  return token;
};

export const checkToken = (token) =>
  jwt.verify(token, "BIMAT", (error, decode) => error);

export const createRefToken = (data) => {
  let token = jwt.sign({ data }, "KO_BIMAT", {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return token;
};

export const checkRefToken = (token) =>
  jwt.verify(token, "KO_BIMAT", (error, decode) => error);

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const verifyToken = (req, res, next) => {
  // check hợp lệ
  let { token } = req.headers;
  console.log("Received token:", token);
  let check = checkToken(token);
  if (check == null) {
    next();
  } else {
    //token ko hợp lệ
    res.status(401).send(check.name);
  }
};
