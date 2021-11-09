import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  hashedPassword: string;
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
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

UserSchema.statics.findByUsername = async function (username: string) {
  return this.findOne({ username });
};

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default User;
