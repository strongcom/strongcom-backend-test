import Joi from "joi";
import User from "../../models/schema/user.js";
import authController from "../../controller/authController.js";

const {registerValidationCheck, usernameDuplicate} = authController();

export const register = async ctx =>{
    console.log(ctx);
    const {userId, password} = ctx.request.body;
    const result = registerValidationCheck(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const exists = await usernameDuplicate(userId);
        if(exists) {
            ctx.status = 409;
            return;
        }

        const user = new User({userId,});
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize();
        const token = user.generateToken();
        ctx.cookies.set('access_token', token,{
            maxAge: 1000*60 * 60 * 24 *7,
            httpOnly: true,
        });
    }catch(e){
        ctx.throw(500,e);
    }
};

export const login = async ctx =>{
    const { userId, password} = ctx.request.body;

    if(!userId|| !password) {
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUsername(userId);
        if(!user){
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        if(!valid){
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        const token = user.generateToken();
        ctx.cookies.set('access_token', token,{
            maxAge: 1000*60 * 60 * 24 *7,
            httpOnly: true,
        });
    }catch(e){
        ctx.throw(500,e);
    }
};

export const check = async ctx =>{
    const {user} = ctx.state;
    if(!user){
        ctx.status =401;
        return;
    }
    ctx.body = user;
};

export const logout = async ctx =>{

};
