import notificationController from "../../controller/notificationController.js";

const {testPush,pushNotifications} = notificationController();
export const test = async ctx => {
    try{
        ctx = {...await testPush(ctx)};
        ctx.status = 204;
    }catch (e){
        ctx.throw(500, e);
    }
}

export const detectedUser = async ctx => {
    const {userName, time} = ctx.request.body;

    try{
        await pushNotifications(ctx);
        ctx.status = 204;
        ctx.body = {
            userName: userName,
            time: time,
        };
    }catch (e) {
        ctx.throw(500, e);
    }
}
