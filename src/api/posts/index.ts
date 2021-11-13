import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts
  .get('/', postsCtrl.list)
  .post('/', checkLoggedIn, postsCtrl.write)
  .get('/:id', postsCtrl.getPostById, postsCtrl.read)
  .delete(
    '/:id',
    postsCtrl.getPostById,
    checkLoggedIn,
    postsCtrl.checkOwnPost,
    postsCtrl.remove,
  )
  .patch(
    '/:id',
    postsCtrl.getPostById,
    checkLoggedIn,
    postsCtrl.checkOwnPost,
    postsCtrl.update,
  );

export default posts;
