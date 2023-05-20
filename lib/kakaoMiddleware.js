import authController from "../src/controller/authController.js";

const kakaoMiddleware = async (ctx, next) => {
    const {getUserInfoFromKakao} = authController();
    const accessToken = ctx.headers['access_token'];

    if (!accessToken) {
        return next();
    }
    try {
        const userInfo = await getUserInfoFromKakao(accessToken);
        if (userInfo) {
            ctx.state.user = {
                kakaoId: userInfo.id
            }
        }
        return next();
    } catch (e) {
        return next();
    }
};

export default kakaoMiddleware;
