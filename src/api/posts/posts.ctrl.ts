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
    ctx.throw(500, e as Error);
  }
};

export const list: IMiddleware = async (ctx) => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e as Error);
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
    ctx.throw(500, e as Error);
  }
};

export const remove: IMiddleware = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e as Error);
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
    ctx.throw(500, e as Error);
  }
};
