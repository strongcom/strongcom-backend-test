import Router from "koa-router";
import * as authCtrl from "./auth.ctrl.js";
import 'dotenv/config';
import checkLoggedIn from "../../../lib/checkLoggedIn.js";
import {getUserInfo} from "./auth.ctrl.js";

const auth = new Router();


auth.post('/kakao', authCtrl.kakao);
auth.post('/username', checkLoggedIn, authCtrl.postUsername);
auth.get('/userinfo', checkLoggedIn, authCtrl.getUserInfo);
// auth.post('/login', authCtrl.login);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;
