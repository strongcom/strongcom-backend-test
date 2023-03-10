import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    userId: String,
    hashedPassword: String,
});

UserSchema.methods.setPassword = async function(password){
    this.hashedPassword = await bcrypt.hash(password, 10);
};

UserSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.hashedPassword);
};

UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        {
            _id: this.id,
            userId: this.userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    )
    return token;
};

UserSchema.statics.findByUsername = function(userId){
    return this.findOne({userId});
};

const User = mongoose.model('User', UserSchema);
export default User;


