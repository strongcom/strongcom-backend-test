import Joi from "joi";
import User from "../../models/schema/user.js";
import authController from "../../controller/authController.js";
export const register = async ctx =>{
    const {registerValidationCheck, usernameDuplicate} = authController();
    const {username, password} = ctx.request.body;
    const result = registerValidationCheck(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const exists = await usernameDuplicate(username);
        if(exists) {
            ctx.status = 409;
            return;
        }

        const user = new User({username,});
        await user.setPassword(password);
        await user.save();

        const data = user.toJSON();
        delete data.hashedPassword;
        ctx.body=data;
    }catch(e){
        ctx.throw(500,e);
    }
};

export const login = async ctx =>{

};

export const check = async ctx =>{

};

export const logout = async ctx =>{

};
