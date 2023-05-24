import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    nickname: String,
    kakaoId: String,
    userName: String,
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
//             userName: this.userName,
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: '7d',
//         }
//     );
// };

UserSchema.statics.findByuserName = function(userName){
    return this.findOne({userName});
};

UserSchema.statics.findByKakaoId = function(id){
    return this.findOne({kakaoId: id});
}

const User = mongoose.model('User', UserSchema);
export default User;


