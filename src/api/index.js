import Router from 'koa-router';
import reminders from './reminder/index.js';
import auth from './auth/index.js';
import push from './push/index.js';

const api = new Router();

api.use('/reminder', reminders.routes());
api.use('/auth', auth.routes());
api.use('/push', push.routes());

export default api;
