import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

posts
  .get('/', postsCtrl.list)
  .post('/', postsCtrl.write)
  .get('/:id', postsCtrl.read)
  .delete('/:id', postsCtrl.remove)
  .put('/:id', postsCtrl.replace)
  .patch('/:id', postsCtrl.update);

export default posts;
