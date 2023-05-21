import Router from 'koa-router';
import * as reminderCtrl from './reminder.ctrl.js';
import checkLoggedIn from "../../../lib/checkLoggedIn.js";
import {getReminderById, getReminderTitleList, getTodayReminderList, postReminderByTitle} from "./reminder.ctrl.js";

const reminders= new Router();

// reminders.get('/',checkLoggedIn, reminderCtrl.getReminderList);
reminders.get('/',checkLoggedIn, reminderCtrl.getReminderList);
reminders.get('/today', checkLoggedIn,reminderCtrl.getTodayReminderList);
reminders.post('/', checkLoggedIn,reminderCtrl.postReminder);
// TODO 빅스비 전용 api 로그인 요청하도록 변경하기
reminders.get('/title', reminderCtrl.getReminderTitleList);
reminders.post('/title',reminderCtrl.postReminderByTitle);

const reminder = new Router();
reminder.get('/', reminderCtrl.getReminderById);
reminder.patch('/', checkLoggedIn, reminderCtrl.checkOwnReminder,reminderCtrl.patchReminder);
reminder.delete('/', checkLoggedIn, reminderCtrl.checkOwnReminder,reminderCtrl.deleteReminder);

reminders.use('/:id', reminderCtrl.findReminderById, reminder.routes());

export default reminders;
