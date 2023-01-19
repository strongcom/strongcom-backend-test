import mongoose from "mongoose";

const {Schema} = mongoose;

const ReminderSchema = new Schema({
    userId: String,
    title: String,
    subtitle: String,
    content: String,
    startDate: Date,
    endDate: Date,
    RepetitionId: String,
    RepetitionPeriod: String,
    RepetitionDay: String,
});

const Reminder = mongoose.model('Reminder', ReminderSchema);
export default Reminder;