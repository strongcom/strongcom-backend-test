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
    const testPush = async (ctx) => {
        let deviceToken = 'cdjNdVk_Rme3Z4E8868dmo:APA91bGIvnL4HogW7-p3_gtrJ1sYeVIR2XzOEJGHXOhL563ODarBzAJLjZCSecYc4H8our__ItYrEdXW--yhKi279C1Ir7EAx6lRE-Ivv25N6ooIco_B4sHjbE0fXSqAVdSklX13a8mS';

        let message = {
            notification: {
                title: '텀블러 챙기기',
            },
            token: deviceToken
        }

        await admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log('success', response);
                ctx.status = 204;
            })
            .catch((error) => {
                console.log('success', error);
                ctx.status = 404;
                ctx.body = error;
            });

        return ctx;
    }

    const pushNotifications = async (ctx) => {
        const date = dayjs();
        const today = date.format('YYYY-MM-DD');
        const now = date.format('hh:mm:ss');
        const user = await User.findOne({username: ctx.request.body.username});
        const todayReminders = await Reminder
            .find({
                $and: [
                    {"userInfo._id": user._id},
                    {notices: today},
                    {startTime: {$lte: now}},
                    {endTime: {$gte: now}},
                ]
            });
        for (const reminder of todayReminders) {
            let message = {
                notification: {
                    title: reminder.title,
                },
                token: user.targetToken
            };
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
    }

    return {
        testPush,
        pushNotifications
    }
}
