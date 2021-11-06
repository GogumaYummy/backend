import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

posts
  .get('/', postsCtrl.list)
  .post('/', postsCtrl.write)
  .get('/:id', postsCtrl.checkObjectId, postsCtrl.read)
  .delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove)
  .patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

export default posts;
