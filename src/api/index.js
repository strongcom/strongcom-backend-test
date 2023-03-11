import Router from 'koa-router';
import reminders from './reminder/index.js';
import auth from './auth/index.js';

const api = new Router();

api.use('/reminder', reminders.routes());
api.use('/auth', auth.routes());

export default api;
