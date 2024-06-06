import { getPostsPaged } from '../../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { Posts } from '../types/post';
import PostCard from './PostCard';

dayjs.extend(relativeTime);
dayjs.locale('en');

export default async function ListPosts() {

  const posts: Posts = await getPostsPaged(25, 1);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (<PostCard key={post._id} {...post} />))}
      </div>
    </div>
  );
}
