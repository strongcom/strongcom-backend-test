import notificationController from "../../controller/notificationController.js";

export const test = async ctx => {
    ctx = {...await notificationController(ctx)}
}

export const detectedUser = async ctx => {
    const {username, time} = ctx.request.body;
    try{
        ctx.body = {
            username: username,
            time: time,
        };
    }catch (e) {
        ctx.throw(500, e);
    }
}
