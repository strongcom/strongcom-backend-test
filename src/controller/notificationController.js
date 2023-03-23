import admin from 'firebase-admin';
import serviceAccount from '../strongcom-firebase-adminsdk-dewbw-03cf5bffe3.json' assert { type: "json" };
export default function notificationController(ctx){

    if (!admin.apps.length) {
        let firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    let deviceToken ='cdjNdVk_Rme3Z4E8868dmo:APA91bGIvnL4HogW7-p3_gtrJ1sYeVIR2XzOEJGHXOhL563ODarBzAJLjZCSecYc4H8our__ItYrEdXW--yhKi279C1Ir7EAx6lRE-Ivv25N6ooIco_B4sHjbE0fXSqAVdSklX13a8mS';
    let message = {
        notification:{
            title:'test',
            body:'test message'
        },
        token: deviceToken
    }

    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('success',response);
            ctx.status = 200;
            ctx.body = {success: response}
            return ctx
        })
        .catch((error) => {
            console.log('success',error);
            ctx.status = 400;
            ctx.body = {success: false};
            return ctx
        });
}
