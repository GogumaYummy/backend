import mongoose, { Schema, Document, Model, FlattenMaps } from 'mongoose';
import bcrypt from 'bcrypt';
import { LeanDocument } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  username: string;
  hashedPassword?: string;
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => any;
  generateToken: () => string;
}

export interface IUserModel extends Model<IUser> {
  findByUsername: (username: string) => Promise<IUser>;
}

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 7 * 24 * 60 * 60,
    },
  );
  return token;
};

UserSchema.statics.findByUsername = async function (username: string) {
  return this.findOne({ username });
};

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default User;
