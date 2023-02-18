import Router from 'koa-router';
import reminder from './reminder/index.js';
import auth from './auth/index.js';

const api = new Router();

api.use('/reminder', reminder.routes());
api.use('/auth', auth.routes());

export default api;
