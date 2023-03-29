import Router from 'koa-router';
import * as reminderCtrl from './reminder.ctrl.js';
import checkLoggedIn from "../../../lib/checkLoggedIn.js";

const reminders= new Router();

reminders.get('/',checkLoggedIn, reminderCtrl.getReminderList);
reminders.post('/', checkLoggedIn,reminderCtrl.postReminder);

const reminder = new Router();
reminder.patch('/', checkLoggedIn, reminderCtrl.checkOwnReminder,reminderCtrl.patchReminder);
reminder.delete('/', checkLoggedIn, reminderCtrl.checkOwnReminder,reminderCtrl.deleteReminder);

reminders.use('/:id', reminderCtrl.getReminderById, reminder.routes());

export default reminders;
