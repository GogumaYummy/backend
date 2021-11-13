import Joi from 'joi';
import { Middleware } from 'koa';
import { Types } from 'mongoose';
import Post from '../../models/post';
const { isValid } = Types.ObjectId;

export const getPostById: Middleware = async (ctx, next) => {
  const { id } = ctx.params;
  if (!isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
  return next();
};

export const checkOwnPost: Middleware = (ctx, next) => {
  const { user, post } = ctx.state;
  if (user._id.toString() !== post.user._id.toString()) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};

export const list: Middleware = async (ctx) => {
  if (Array.isArray(ctx.query.page)) {
    ctx.status = 400;
    return;
  }

  const page: number = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount: number = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', String(Math.ceil(postCount / 10)));
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};

export const read: Middleware = (ctx) => {
  ctx.body = ctx.state.post;
};

export const remove: Middleware = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};

export const update: Middleware = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { id } = ctx.params;

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};
