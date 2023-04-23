import Router from "koa-router";
import * as pushCtrl from "./push.ctrl.js";

const push = new Router();

push.get('/test', pushCtrl.test);
push.post('/userId', pushCtrl.detectedUser);

export default push;
