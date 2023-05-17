import jwt from "jsonwebtoken";
import User from "../src/models/schema/user.js";

const jwtMiddleware = async (ctx, next) => {
    const refreshToken = ctx.cookies.get('refresh_token');
    const accessToken = ctx.cookies.get('access_token');

    //토큰 둘다 만료
    if (!accessToken && !refreshToken) {
        return next();
    }
    try {
        //엑세스 토큰만 만료
        if (refreshToken && !accessToken) {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
            ctx.state.user = {
                _id: decodedRefreshToken._id,
                username: decodedRefreshToken._username,
            }
            const user = await User.findById(decodedRefreshToken._id);
            //엑세스 토큰 재발급
            const newAccessToken = user.generateToken();
            ctx.cookies.set('access_token', newAccessToken,{
                maxAge: 1000*60*60,
                httpOnly: true,
            });
            //리프레시 토큰도 유효기간 3일 미만으로 남았다면 재발급
            const now = Math.floor(Date.now() / 1000);
            if (decodedRefreshToken.exp - now < 60 * 60 * 24 * 3) {
                const newRefreshToken = user.generateToken();
                ctx.cookies.set('refresh_token', newRefreshToken,{
                    maxAge: 1000*60*60*24*7,
                    httpOnly: true,
                });
            }
        }
        else if (!refreshToken && accessToken){ //리프레시만 만료
            const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            ctx.state.user = {
                _id: decodedAccessToken._id,
                username: decodedAccessToken._username,
            }
            const user = await User.findById(decodedAccessToken._id);
            //엑세스 토큰 재발급
            const newRefreshToken = user.generateToken();
            ctx.cookies.set('refresh_token', newRefreshToken,{
                maxAge: 1000*60*60*24*30,
                httpOnly: true,
            });
        }
        return next();
    } catch (e) {
        return next();
    }
};

export default jwtMiddleware;
