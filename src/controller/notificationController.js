import admin from 'firebase-admin';
import firebaseKey from '../firebase-key.json' assert {type: "json"};
import User from "../models/schema/user.js";
import Reminder from "../models/schema/reminder.js";
import dayjs from "dayjs";

export default function notificationController() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseKey),
        });
    }
    const pushNotice = async ({message}) => {
        await admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log('success', response);
            })
            .catch((error) => {
                console.log('success', error);
            });
    }
    const testPush = async (ctx) => {
        let deviceToken = 'cdjNdVk_Rme3Z4E8868dmo:APA91bGIvnL4HogW7-p3_gtrJ1sYeVIR2XzOEJGHXOhL563ODarBzAJLjZCSecYc4H8our__ItYrEdXW--yhKi279C1Ir7EAx6lRE-Ivv25N6ooIco_B4sHjbE0fXSqAVdSklX13a8mS';
        let message = {
            notification: {
                title: '텀블러 챙기기',
            },
            token: deviceToken,
            android: {
                priority: 'high',
                notification: {
                    sound: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                    }
                }
            }
        }
        await pushNotice(message);
        return ctx;
    }

    const findTodayReminders = async ({user}) => {
        const date = dayjs();
        const today = date.format('YYYY-MM-DD');
        const now = date.format('hh:mm:ss');
        return Reminder
            .find({
                $and: [
                    {"userInfo._id": user._id},
                    {notices: today},
                    {startTime: {$lte: now}},
                    {endTime: {$gte: now}},
                ]
            });
    };

    const removeNoticesDate = async ({user}) => {
        const date = dayjs();
        const today = date.format('YYYY-MM-DD');
        const now = date.format('hh:mm:ss');

        await Reminder.updateMany({
                $and: [
                    {"userInfo._id": user._id},
                    {notices: today},
                    {startTime: {$lte: now}},
                    {endTime: {$gte: now}},
                ]
            }, {
                $pull: {notices: today}
            },
            {multi: true});
    };

    const removeCompletedReminder = async () => {
        await Reminder.deleteMany({notices: {$size: 0}},);
    }

    const pushNotifications = async (ctx) => {
        const user = await User.findOne({username: ctx.request.body.username});
        const todayReminders = await findTodayReminders({user: user});

        for (const reminder of todayReminders) {
            console.log(reminder)
            let message = {
                notification: {
                    title: reminder.title,
                },
                token: user.targetToken
            };
            await pushNotice({message:message});
        }
        await removeNoticesDate({user: user}).then(
            await removeCompletedReminder()
        )
    }

    return {
        testPush,
        pushNotifications
    }
}
