import Router from 'koa-router';
import * as reminderCtrl from './reminder.ctrl.js';
import checkLoggedIn from "../../../lib/checkLoggedIn.js";

const reminder= new Router();

reminder.get('/', checkLoggedIn,reminderCtrl.getReminderList);
reminder.post('/', checkLoggedIn,reminderCtrl.postReminder);

export default reminder;
