import Router from 'koa-router';
import * as reminderCtrl from './reminder.ctrl.js';
import checkLoggedIn from "../../../lib/checkLoggedIn.js";

const reminder= new Router();

reminder.get('/',reminderCtrl.getReminderList);
// reminder.post('/', checkLoggedIn,reminderCtrl.postReminder);
reminder.post('/', reminderCtrl.postReminder);
reminder.patch('/', checkLoggedIn,reminderCtrl.checkOwnReminder,reminderCtrl.patchReminder);

reminder.use('/:id', reminderCtrl.getReminderById);

export default reminder;
