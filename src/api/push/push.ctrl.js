import notificationController from "../../controller/notificationController.js";

const {testPush,pushNotifications} = notificationController();
export const test = async ctx => {
    try{
        ctx = {...await testPush(ctx)};
    }catch (e){
        ctx.throw(500, e);
    }
}

export const detectedUser = async ctx => {
    const {username, time} = ctx.request.body;
    await pushNotifications(ctx);
    try{
        ctx.body = {
            username: username,
            time: time,
        };
    }catch (e) {
        ctx.throw(500, e);
    }
}
