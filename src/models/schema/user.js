import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    nickname: String,
    kakaoId: String,
    username: String,
    // hashedPassword: String,
    targetToken: String,
    refreshToken: String,
    idToken: String,
    accessTokenExpiresAt: Date,
    refreshTokenExpiresAt: Date
});

// UserSchema.methods.setPassword = async function(password){
//     this.hashedPassword = await bcrypt.hash(password, 10);
// };
//
// UserSchema.methods.checkPassword = async function(password){
//     return await bcrypt.compare(password, this.hashedPassword);
// };

UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    // delete data.hashedPassword;
    delete data.refreshToken;
    delete data.targetToken;
    return data;
};
//
// UserSchema.methods.generateToken = function(){
//     return jwt.sign(
//         {
//             _id: this.id,
//             username: this.username,
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: '7d',
//         }
//     );
// };

UserSchema.statics.findByUsername = function(username){
    return this.findOne({username});
};

UserSchema.statics.findByKakaoId = function(kakaoId){
    return this.findOne({kakaoId});
}

const User = mongoose.model('User', UserSchema);
export default User;


