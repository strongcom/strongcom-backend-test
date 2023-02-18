import Reminder from '../../models/schema/reminder.js';
import dayjs from "dayjs";
import reminderController from "../../controller/reminderController.js";

export const getReminderList = async ctx => {
    try {
        let query = ctx.request.query;
        let reminderList = await Reminder.find().exec();
        if(query.filter === 'today'){
            reminderList = reminderList.filter(v => dayjs(v.startDate).add(-9, 'hour').isSame(dayjs(), 'day'))
        }
        else if(query.filter === 'active'){
            reminderList = reminderList.filter(v => !(dayjs(v.endDate).add(-9, 'hour').isBefore(dayjs())))
        }
        ctx.body = reminderList;
    } catch (e) {
        ctx.throw(500, e)
    }
}

export const postReminder = async ctx => {
    console.log(ctx.state.user);
    const reminderEntity = reminderController().main(ctx.request.body, ctx.state.user);
    const reminder = new Reminder(reminderEntity);

    try {
        console.log('reminder post result\n', reminder)
        await reminder.save();
        ctx.body = reminder;
    } catch (e) {
        ctx.throw(500, e);
    }
};
