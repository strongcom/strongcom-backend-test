import Reminder from '../../models/schema/reminder.js';
import dayjs from "dayjs";
import reminderController from "../../controller/reminderController.js";
import mongoose from "mongoose";
import notificationController from "../../controller/notificationController.js";

const {ObjectId} = mongoose.Types;
const {reminderDtoToEntity} = reminderController();

export const getReminderList = async ctx => {
    console.log(ctx.request)
    try {
        let {filter} = ctx.request.query;
        let reminderList = await Reminder.find().exec();
        if (filter === 'today') {
            // reminderList = reminderList.filter(v => dayjs(v.startDate).add(-9, 'hour').isSame(dayjs(), 'day'))
            reminderList = reminderList.filter(reminder => {
                let today = false;
                for(let date of reminder.notices){
                    if(dayjs(date).isSame(dayjs())){
                        today = true;
                        break;
                    }
                }
                return today;
            });
        }
        ctx.body = reminderList;
    } catch (e) {
        ctx.throw(500, e)
    }
}

export const getReminderById = async (ctx, next) => {
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

export const pushReminder = async ctx => {
    console.log('pushReminder');
    ctx = notificationController(ctx);
}
