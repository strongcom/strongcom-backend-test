//      
import Reminder from '../../models/schema/reminder.js';
                                                                      

export const getReminderList = async ctx => {
    try{
        ctx.body = await Reminder.find().exec();
    }catch(e){
        ctx.throw(500,e)
    }
}

export const postReminder = async ctx=>{
    const reminderPostDto = ctx.request.body;
    const reminder = new Reminder(reminderPostDto);
    try{
        await reminder.save();
        ctx.body = reminder;
    } catch(e){
        ctx.throw(500,e);
    }
};