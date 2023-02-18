import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: String,
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
}

UserSchema.statics.findByUsername = function(username){
    return this.findOne({username});
}

const User = mongoose.model('User', UserSchema);
export default User;


