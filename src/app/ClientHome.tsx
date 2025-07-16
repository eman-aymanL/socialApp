'use client';

import React from 'react';
import { Box } from '@mui/material';
import PostCreation from './_Components/PostCreation/PostCreation';
import Post from './_Components/Post/Post';
import { PostType } from './_interfaces/posts.types';

type Props = {
  posts: PostType[];
};

export default function ClientHome({ posts }: Props) {
  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', py: 4 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: {
              xs: '100%', 
              sm: '80%',  
              md: '60%',  
            },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <PostCreation onPostCreated={() => {}} />
          {posts.map((post) => (
            <Post key={post._id} postDetails={post} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
