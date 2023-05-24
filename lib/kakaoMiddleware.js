import authController from "../src/controller/authController.js";
import User from "../src/models/schema/user.js";

const kakaoMiddleware = async (ctx, next) => {
    const {getUserInfoFromKakao} = authController();
    const accessToken = ctx.headers['access_token'];

    if (!accessToken) {
        return next();
    }
    try {
        const userInfo = await getUserInfoFromKakao(accessToken);
        const findUser = await User.findOne({kakaoId: userInfo.id})
        if (userInfo && findUser) {
            ctx.state.user = {
                kakaoId: userInfo.id,
                userName: findUser.userName
            }
        }
        return next();
    } catch (e) {
        return next();
    }
};

export default kakaoMiddleware;
