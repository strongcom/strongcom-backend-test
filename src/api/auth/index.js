import Router from "koa-router";
import * as authCtrl from "./auth.ctrl.js";
import 'dotenv/config';
import {kakao} from "./auth.ctrl.js";


const auth = new Router();


auth.post('/kakao', authCtrl.kakao);
auth.post('/login', authCtrl.login);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;
