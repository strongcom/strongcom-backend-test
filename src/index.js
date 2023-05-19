import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from "../lib/jwtMiddleware.js";
import 'dotenv/config';
import pages from "./views/index.js";

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'strongcom',
})
    .then(() => {
        console.log('Connecting to MongoDB');
    })
    .catch(err => console.log(err));

const app = new Koa();
const router = new Router();

let corsOptions = {
    credentials: true,
}

// CORS 허용
app.proxy = true; // true 일때 proxy 헤더들을 신뢰함
app.use(cors(corsOptions));

router.use('/api', api.routes());
router.use('/views', pages.routes());

// 라우터를 적용하기 전에 bodyParser를 먼저 적용해야함.
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용하기
app.use(router.routes()).use(router.allowedMethods());

//포트 개방
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
