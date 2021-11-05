import { createSchema, Type, typedModel } from 'ts-mongoose';

const PostSchema = createSchema({
  title: Type.string(),
  body: Type.string(),
  tags: Type.array().of(Type.string()),
  publishedDate: Type.date({ default: Date.now() }),
});

const Post = typedModel('Post', PostSchema);
export default Post;
