import mongoose from "mongoose";

const {Schema} = mongoose;

const ReminderSchema = new Schema({
    userInfo: {
        kakaoId: String,
        userName: String,
    },
    title: String,
    subTitle: String,
    content: String,
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    repetitionPeriod: String,
    repetitionDay: [String],
    notices: [String],
});

const Reminder = mongoose.model('Reminder', ReminderSchema);
export default Reminder;
