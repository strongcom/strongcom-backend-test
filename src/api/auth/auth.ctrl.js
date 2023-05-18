import User from "../../models/schema/user.js";
import authController from "../../controller/authController.js";
import passport from "koa-passport";
import {Strategy as KakaoStrategy} from "passport-kakao";
import 'dotenv/config';

const {registerValidationCheck, usernameDuplicate} = authController();

passport.use(
    new KakaoStrategy(
        {
            clientID: process.env.KAKAO_ID,
            callbackURL: process.env.REDIRECT_URI,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({kakaoId: profile.id});
                if(user){
                    done(null, user);
                }else{
                    const newUser = new User({
                        kakaoId: profile.id,
                        nickname: profile.displayName,
                    })
                    await newUser.save();
                    done(null, newUser);
                }
            }catch (e) {
                done(e);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

export const register = async ctx => {
    console.log(ctx);
    const {username, password, targetToken} = ctx.request.body;
    const result = registerValidationCheck(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try {
        const exists = await usernameDuplicate(username);
        if (exists) {
            ctx.status = 409;
            return;
        }

        const user = new User({username, targetToken});
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize();
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
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const kakao = passport.authenticate('kakao');

export const callback = async ctx => {
    try{
        passport.authenticate('kakao', {
            successRedirect: '/profile',
            failureRedirect: '/kakao',
        })
    }catch (e){
        ctx.throw(500, e);
    }
}

export const profile = async ctx => {
    if (ctx.isAuthenticated()) {
        const { displayName, id } = ctx.state.user;
        ctx.body = `Welcome, ${displayName} (ID: ${id})`;
    } else {
        ctx.redirect('/login');
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
