import Router from "koa-router";
import * as pushCtrl from "./push.ctrl.js";

const push = new Router();

push.get('/test', pushCtrl.test);

export default push;
