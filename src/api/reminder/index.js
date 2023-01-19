import Router from 'koa-router';
import * as reminderCtrl from './reminder.ctrl.js';

const reminder= new Router();

reminder.get('/', reminderCtrl.getReminderList);
reminder.post('/', reminderCtrl.postReminder);

export default reminder;