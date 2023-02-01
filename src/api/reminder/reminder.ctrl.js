//
import Reminder from '../../models/schema/reminder.js';

import {ProcessingPostDto} from "../../utils/ProcessingPostDto.js";
import dayjs from "dayjs";

export const getReminderList = async ctx => {
    try {
        let reminderList = await Reminder.find().exec();
        ctx.body = reminderList.filter(v=>dayjs(v.startDate).add(-9,'hour').isSame(dayjs(),'day'));
    } catch (e) {
        ctx.throw(500, e)
    }
}

export const postReminder = async ctx => {
    const reminderPostDto                 = ctx.request.body;
    const reminderRepetitionList = new ProcessingPostDto(reminderPostDto).getReminderRepetitionList();
    const reminderList = reminderRepetitionList.map((reminder)=>new Reminder(reminder));
    try {
        console.log('reminder post result\n',reminderList)
        for (const reminder of reminderList) {
            await reminder.save();
        }
        ctx.body = reminderList;
    } catch (e) {
        ctx.throw(500, e);
    }
};
