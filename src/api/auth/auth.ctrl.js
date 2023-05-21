import User from "../../models/schema/user.js";
import authController from "../../controller/authController.js";
import 'dotenv/config';

const {registerValidationCheck, usernameDuplicate, getUserInfoFromKakao} = authController();

export const kakao = async ctx => {
    const {targetToken, accessTokenExpiresAt, refreshTokenExpiresAt, accessToken,idToken,refreshToken} = ctx.request.body;
    const result = registerValidationCheck(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    try {
        const userInfo = await getUserInfoFromKakao(accessToken);
        const exists = await User.findByKakaoId(userInfo.id);
        if (exists) {
            await User.findOneAndUpdate(
                {kakaoId: userInfo.id},
                {$set: {targetToken, accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, refreshToken,idToken}}
            ).exec();
            ctx.status = 204;
        }else{
            const user = new User({
                kakaoId: userInfo.id,
                nickname: userInfo.properties.nickname,
                targetToken,
                refreshToken,
                accessTokenExpiresAt,
                refreshTokenExpiresAt,
                idToken
            });
            await user.save();
            ctx.status = 200;
            ctx.body = user.serialize();
        }
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const postUsername = async ctx =>{
    const {username} = ctx.request.body;
    try{
        const exists = await usernameDuplicate(username);
        if (exists) {
            ctx.status = 409;
            return;
        }
        await User.findOneAndUpdate(
            {kakaoId: ctx.state.user.kakaoId},
            {$set: {username: username}}
        ).exec();
        console.log(ctx.state.user.kakaoId)
        ctx.status = 204;
    }catch (e) {
        ctx.throw(500, e);
    }
}

export const getUserInfo = async ctx =>{
    try{
        const user = await User.findOne(
            {kakaoId: ctx.state.user.kakaoId},
        );
        console.log(user)
        ctx.status = 200;
        ctx.body = {
            username: user.username,
            nickname: user.nickname,
        }
    }catch (e) {
        ctx.throw(500, e);
    }
}
export const check = async ctx => {
    const {user} = ctx.state;
    if (!user) {
        ctx.status = 401;
        return;
    }
    ctx.body = user;
};

export const logout = async ctx => {

};
