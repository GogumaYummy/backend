import Router, { IMiddleware } from 'koa-router';
const posts = new Router();

const printInfo: IMiddleware = (ctx) => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

posts
  .get('/', printInfo)
  .post('/', printInfo)
  .get('/:id', printInfo)
  .delete('/:id', printInfo)
  .put('/:id', printInfo)
  .patch('/:id', printInfo);

export default posts;
