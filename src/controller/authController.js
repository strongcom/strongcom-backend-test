import Joi from "joi";
import User from "../models/schema/user.js";

export default function authController(){
    const registerValidationCheck= (body) => {
        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().required(),
            targetToken: Joi.string().required(),
        });
        return schema.validate(body);
    }

    const usernameDuplicate = async (username) => {
        const exists = await User.findByUsername(username);
        return !!exists;
    }

    return{
        registerValidationCheck,
        usernameDuplicate
    }
}

