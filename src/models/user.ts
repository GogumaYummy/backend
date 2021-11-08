import { createSchema, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema({
  username: Type.string({ required: true }),
  hashedPassword: Type.string({ required: true }),
});

const User = typedModel('User', UserSchema);

export default User;
