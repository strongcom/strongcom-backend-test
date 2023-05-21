import Reminder from '../../models/schema/reminder.js';
import dayjs from "dayjs";
import reminderController from "../../controller/reminderController.js";
import mongoose from "mongoose";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const {ObjectId} = mongoose.Types;
const {
    reminderDtoToEntity,
    generateReminderByTitle,
    repetitionValidationCheck,
    titleValidationCheck
} = reminderController();

export const getReminderList = async ctx => {
    try {
        ctx.body = (await Reminder
            .find({'userInfo.kakaoId': ctx.state.user.kakaoId}).exec())
            .map(reminder => ({id: reminder.id,title: reminder.title, subTitle: reminder.subTitle}))
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const getTodayReminderList = async ctx => {
    try{
        ctx.body = (await Reminder
            .find({'userInfo.kakaoId': ctx.state.user.kakaoId}).exec())
            .filter(reminder => {
                for (let date of reminder.notices) {
                    if (dayjs(`${date}T${reminder.startTime}`).isSameOrBefore(dayjs())
                        && dayjs(`${date}T${reminder.endTime}`).isSameOrAfter(dayjs())) {
                        return true;
                    }
                }
                return false;
            });
    }catch (e){
        ctx.throw(500, e);
    }
}

export const getReminderTitleList = async ctx => {
    try {
        let reminderList = await Reminder.find().exec();
        ctx.body = reminderList.map(v => ({title: v.title}));
    } catch (e) {
        ctx.throw(500, e)
    }
}

export const findReminderById = async (ctx, next) => {
    console.log('getReminderById');
    const {id} = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }
    try {
        const reminder = await Reminder.findById(id);
        if (!reminder) {
            ctx.status = 404;
            return;
        }
        ctx.state.reminder = reminder;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const getReminderById = async ctx=>{
    try{
        ctx.status = 200;
        ctx.body = ctx.state.reminder
    }catch (e) {
        ctx.status = 500;
    }
}

export const checkOwnReminder = (ctx, next) => {
    console.log('checkOwnReminder');
    const {user, reminder} = ctx.state;
    if (reminder.userInfo?._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

export const postReminder = async ctx => {
    const validationCheck = repetitionValidationCheck(ctx.request.body)
    if (validationCheck.error) {
        ctx.status = 400;
        ctx.body = validationCheck.error
        return;
    }
    console.log('ctx.state.user',ctx.state.user)
    const reminderEntity = reminderDtoToEntity(ctx.request.body, ctx.state.user);
    const reminder = new Reminder(reminderEntity);

    try {
        console.log('reminder post result\n', reminder)
        await reminder.save();
        ctx.body = reminder;
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const postReminderByTitle = async ctx => {
    const titleValidation = titleValidationCheck(ctx.request.body);

    if (titleValidation.error){
        ctx.status = 400;
        ctx.body = titleValidation.error;
        return
    }

    const {title} = ctx.request.body;
    const reminder = new Reminder(generateReminderByTitle(title, ctx.state.user));

    try {
        await reminder.save();
        ctx.body = {
            title: reminder.title
        }
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const patchReminder = async ctx => {
    console.log('patchReminder');
    const {id} = ctx.params;
    const reminderEntity = reminderDtoToEntity(ctx.request.body, ctx.state.user);
    try {
        const reminder = await Reminder.findByIdAndUpdate(id, reminderEntity, {
            new: true,
        }).exec();
        if (!reminder) {
            ctx.status = 404;
            return;
        }
        ctx.body = reminder;
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const deleteReminder = async ctx => {
    console.log('deleteReminder');
    const {id} = ctx.params;
    try {
        await Reminder.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
}
