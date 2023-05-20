import Joi from "joi";
import User from "../models/schema/user.js";
import axios from "axios";
import * as https from "https";

export default function authController(){
    const registerValidationCheck= (body) => {
        const schema = Joi.object().keys({
            // username: Joi.string().alphanum().min(3).max(20).required(),
            targetToken: Joi.string().required(),
            accessTokenExpiresAt: Joi.string().required().isoDate(),
            refreshTokenExpiresAt: Joi.string().required().isoDate(),
            idToken: Joi.string().optional().allow(null),
            accessToken: Joi.string().required(),
            refreshToken: Joi.string().required(),
            scopes: Joi.array().required(),
        });
        return schema.validate(body);
    }

    const usernameDuplicate = async (username) => {
        const exists = await User.findByUsername(username);
        return !!exists;
    }

    const getUserInfoFromKakao = async (accessToken) => {
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        };
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', options);
        return response.data;
    }

    return{
        registerValidationCheck,
        usernameDuplicate,
        getUserInfoFromKakao
    }
}

