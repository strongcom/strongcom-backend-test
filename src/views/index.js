import path from "path";
import Router from "koa-router";
import views from "koa-views";

const pages = new Router();

pages.use(views(path.join('src/','views'),{
    extension: 'nunjucks'
}));
pages.get('/login', async (ctx) => {
    await ctx.render('login', {clientId: process.env.KAKAO_ID, redirectUri: process.env.BIXBY_URL});
});
pages.get('/success',async (ctx) => {
    await ctx.render('success');
});

export default pages;
