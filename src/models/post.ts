import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  body: string;
  tags: string[];
  publishedDate: number;
}

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Number,
    default: Date.now(),
  },
});

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
