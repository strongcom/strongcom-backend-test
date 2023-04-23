import notificationController from "../../controller/notificationController.js";

export const test = async ctx => {
    ctx = {...await notificationController(ctx)}
}

export const detectedUser = async ctx => {
    const {userId} = ctx.request.body;
    try{
        ctx.body = userId;
    }catch (e) {
        ctx.throw(500, e);
    }
}
