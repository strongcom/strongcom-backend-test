import notificationController from "../../controller/notificationController.js";

export const test = async ctx => {
    ctx = {...await notificationController(ctx)}
}

export const detectedUser = async ctx => {
    const {userId, time} = ctx.request.body;
    try{
        ctx.body = {
            userId: userId,
            time: time,
        };
    }catch (e) {
        ctx.throw(500, e);
    }
}
