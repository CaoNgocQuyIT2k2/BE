import express from 'express';
import {login,signUp,loginFacebook, tokenRef, logout} from '../controllers/authController.js' 

const authRoute = express.Router();

//login
authRoute.post("/login",login)

//sign up
authRoute.post("/signup",signUp)

//login
authRoute.post("/login-facebook",loginFacebook)

//ref token
authRoute.post("/token-ref",tokenRef)

//logout 
authRoute.post("/logout",logout)


export default authRoute;   
// mã hóa password
// so sánh dữ liệu thô và dữ liệu mã hóa