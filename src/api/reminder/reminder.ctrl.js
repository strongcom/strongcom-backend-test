import Reminder from '../../models/schema/reminder.js';
import dayjs from "dayjs";
import reminderController from "../../controller/reminderController.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
const {reminderDtoToEntity} = reminderController();

export const getReminderList = async ctx => {
    console.log(ctx)
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

export const getReminderById = async (ctx,next)=>{
    console.log(ctx.params)
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    try{
        const reminder = await Post.findById(id);
        if(!reminder){
            ctx.status = 404;
            return;
        }
        ctx.state.reminder = reminder;
        return next();
    }catch (e) {
        ctx.throw(500, e);
    }
}

export const checkOwnReminder = (ctx, next) => {
    console.log(ctx.state);
    const { user, reminder } = ctx.state;
    if (reminder.userId._id.toString() !== user._id) {
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
    const {id} = ctx.params;
    const reminderEntity = reminderDtoToEntity(ctx.request.body, ctx.state.user);
    try{
        const reminder = await Reminder.findByIdAndUpdate(id, reminderEntity,{
            new:true,
        }).exec();
        if(!reminder){
            ctx.status = 404;
            return;
        }
        ctx.body = reminder;
    }catch(e){
        ctx.throw(500, e);
    }
}
