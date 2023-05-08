import admin from 'firebase-admin';
import firebaseKey from '../firebase-key.json' assert {type: "json"};
export default async function notificationController(ctx){
    let deviceToken ='dhWiH13_Rr-46Tj_gdI-0N:APA91bG4VC9Yv12ky5vBD_67iND6CKKkGJAjhOUzJV_7GS3bWLdeQZChSvHf8fPWCyNm4rEj8HIzUjJopFoEPN4Pq0pWUS8_rQwn2j0wGB-pHn6JjLu3QYHbfJSULdupNzdqdxRKZmXK';

    if (!admin.apps.length) {
        let firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(firebaseKey),
        });
    }

    let message = {
        notification:{
            title:'텀블러 챙기기',
        },
        token: deviceToken
    }

    await admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log('success',response);
            ctx.status = 204;
        })
        .catch((error) => {
            console.log('success',error);
            ctx.status = 404;
            ctx.body = error;
        })

    console.log(ctx)

    return ctx;
}
