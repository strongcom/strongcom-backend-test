import Router from "koa-router";
import * as authCtrl from "./auth.ctrl.js";
import 'dotenv/config';


const auth = new Router();


auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.get('/kakao',  authCtrl.kakao);
auth.get('/kakao/callback', authCtrl.callback);
auth.get('/profile', authCtrl.profile);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;
