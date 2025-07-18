import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PostType } from './_interfaces/posts.types';
import ClientHome from './ClientHome';


export const revalidate = 600;

export default async function Home() {

  const cookieStore = await cookies();
const token = cookieStore.get('userToken')?.value;


  if (!token) {
    redirect('/login');
  }

  async function getAllPosts(): Promise<PostType[]> {
    const res = await fetch('https://linked-posts.routemisr.com/posts?limit=100', {
      headers: {
  Authorization: `Bearer ${token}`,
},

      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error('Failed to fetch posts');

    const data = await res.json();
    return data.posts;
  }

  const allPosts = await getAllPosts();

  return <ClientHome posts={allPosts} />;
}
