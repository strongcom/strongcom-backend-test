import Router from 'koa-router';
import reminder from './reminder/index.js';
const api = new Router();

api.use('/reminder', reminder.routes());

export default api;
