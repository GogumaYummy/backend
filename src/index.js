import Koa from 'koa';
import Router from 'koa-router';
import api from './api/index.js';

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(5001, () => {
  console.log('Listen to port 5001');
});
