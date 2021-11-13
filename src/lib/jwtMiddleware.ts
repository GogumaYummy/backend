import jwt from 'jsonwebtoken';
import { Middleware } from 'koa';
import User from '../models/user';

const jwtMiddleware: Middleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'string') {
      ctx.status = 400;
      return;
    } else {
      ctx.state.user = {
        _id: decoded._id,
        username: decoded.username,
      };
    }

    if (!decoded.exp) {
      ctx.status = 400;
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      if (!user) {
        ctx.status = 401;
        return;
      }
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (err) {
    return next();
  }
};

export default jwtMiddleware;
