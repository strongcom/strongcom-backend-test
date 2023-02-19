import Joi from "joi";
import User from "../models/schema/user.js";

export default function authController(){
    const registerValidationCheck= (body) => {
        const schema = Joi.object().keys({
            userId: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().required(),
        });
        return schema.validate(body);
    }

    const usernameDuplicate = async (userId) => {
        const exists = await User.findByUsername(userId);
        return !!exists;
    }

    return{
        registerValidationCheck,
        usernameDuplicate
    }
}

