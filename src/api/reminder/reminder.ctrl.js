//
import Reminder from '../../models/schema/reminder.js';
import {ProcessingPostDto} from "../../utils/ProcessingPostDto.js";
import dayjs from "dayjs";

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
    const reminderPostDto = ctx.request.body;
    const reminderRepetitionList = new ProcessingPostDto(reminderPostDto).getReminderRepetitionList();
    const reminderList = reminderRepetitionList.map((reminder) => new Reminder(reminder));
    try {
        console.log('reminder post result\n', reminderList)
        for (const reminder of reminderList) {
            await reminder.save();
        }
        ctx.body = reminderList;
    } catch (e) {
        ctx.throw(500, e);
    }
};
