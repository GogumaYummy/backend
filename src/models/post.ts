import { createSchema, Type, typedModel } from 'ts-mongoose';

const PostSchema = createSchema({
  title: Type.string(),
  body: Type.string(),
  tags: Type.array().of(Type.string()),
  publishedDate: Type.date({ default: Date.now() }),
});

const Post = typedModel('Post', PostSchema);
<<<<<<< HEAD
export default Post;
=======
>>>>>>> 0d678d66699a48299823533985831681cdd0a7d9
