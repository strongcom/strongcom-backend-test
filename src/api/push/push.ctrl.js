import notificationController from "../../controller/notificationController.js";

export const test = async ctx => {
    ctx = {...await notificationController(ctx)}
}
