import Router from 'koa-router';

const api = new Router();

api.get('/test', (ctx) => {
  ctx.body = 'test 성공';
});

export default api;
