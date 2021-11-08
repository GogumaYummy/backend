import Joi from 'joi';
import { IMiddleware } from 'koa-router';
import { Types } from 'mongoose';
import Post from '../../models/post';
const { isValid } = Types.ObjectId;

export const checkObjectId: IMiddleware = (ctx, next) => {
  const { id } = ctx.params;
  if (!isValid(id)) {
    ctx.status = 400;
    return;
  }
  return next();
};

export const write: IMiddleware = async (ctx) => {
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

export const list: IMiddleware = async (ctx) => {
  if (Array.isArray(ctx.query.page)) {
    ctx.status = 400;
    return;
  }
  const page: number = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount: number = await Post.countDocuments().exec();
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

export const read: IMiddleware = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();
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

export const remove: IMiddleware = async (ctx) => {
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

export const update: IMiddleware = async (ctx) => {
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
