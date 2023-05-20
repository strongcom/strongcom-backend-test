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
        console.log(userInfo);
        const exists = await User.findByKakaoId(userInfo.kakaoId);
        if (exists) {
            await User.findOneAndUpdate(
                {kakaoId: userInfo.kakaoId},
                {$set: {targetToken, accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, refreshToken,idToken}}
            ).exec();
            ctx.status = 204;
        }else{
            const user = new User({
                kakaoId: userInfo.kakaoId,
                nickname: userInfo.properties.nickname,
                targetToken,
                refreshToken,
                accessTokenExpiresAt,
                refreshTokenExpiresAt,
                idToken
            })
            await user.save();
            ctx.status = 200;
            ctx.body = 'username을 입력해주세요.';
        }
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const login = async ctx => {
    const {username, password} = ctx.request.body;

    if (!username || !password) {
        ctx.status = 401;
        return;
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        if (!valid) {
            ctx.status = 401;
            return;
        }
        const accessToken = user.generateToken();
        const refreshToken = user.generateToken();
        ctx.cookies.set('access_token', accessToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
        });
        ctx.cookies.set('refresh_token', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};
export const postUsername = async ctx =>{
    try{
        const exists = await usernameDuplicate(username);
        if (exists) {
            ctx.status = 409;
            ctx.body = `username 중복`
            return;
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
