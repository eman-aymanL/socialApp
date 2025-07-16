
import React from 'react';
import { cookies } from 'next/headers';
import { PostType } from '@/app/_interfaces/posts.types';
import Box from '@mui/material/Box';
import Post from '@/app/_Components/Post/Post';

export default async function PostDetails(props: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('userToken')?.value;

  async function getSinglePost(): Promise<PostType> {
    const res = await fetch(`https://linked-posts.routemisr.com/posts/${props.params.id}`, {
      headers: {
        token: token || '',
      },
    });
    const data = await res.json();
    return data.post;
  }

  const singlePost = await getSinglePost();

  return (
    <Box component="section" sx={{ width: '50%', mx: 'auto' }}>
      <Post postDetails={singlePost} hasMoreComments />
    </Box>
  );
}
