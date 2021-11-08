import { createSchema, Type, typedModel } from 'ts-mongoose';

const PostSchema = createSchema({
  title: Type.string({ required: true }),
  body: Type.string({ required: true }),
  tags: Type.array().of(Type.string()),
  publishedDate: Type.date({ default: Date.now(), required: true }),
});

const Post = typedModel('Post', PostSchema);

export default Post;
