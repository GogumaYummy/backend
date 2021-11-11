import Joi from 'joi';
import { IMiddleware } from 'koa-router';
import User from '../../models/user';

export const register: IMiddleware = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};
export const login: IMiddleware = async (ctx) => {
  const { username, password } = ctx.request.body;

  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
  } catch (e) {
    if (e instanceof Error) {
      ctx.throw(500, e);
    }
  }
};
export const check: IMiddleware = async (ctx) => {};
export const logout: IMiddleware = async (ctx) => {};
