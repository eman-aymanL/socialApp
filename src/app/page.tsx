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

  let allPosts: PostType[] = [];

  try {
    const res = await fetch('https://linked-posts.routemisr.com/posts?limit=100', {
      headers: {
        token: token,
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error('Failed to fetch posts');

    const data = await res.json();
    allPosts = data.posts;
  } catch (error) {
    allPosts = [];
  }

  return <ClientHome posts={allPosts} />;
}
