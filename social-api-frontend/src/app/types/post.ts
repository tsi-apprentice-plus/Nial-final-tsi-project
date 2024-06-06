type Comments = {
  userId: string;
  timestamp: Date;
  content: string;
};

type Likes = {
  userId: string;
  timestamp: Date;
};

export type Post = {
  userId: string;
  timestamp: Date;
  content: string;
  comments: Comments[];
  likes: Likes[];
  _id?: string;
};
export type Posts = Post[];