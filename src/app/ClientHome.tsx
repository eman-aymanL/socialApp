'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import PostCreation from './_Components/PostCreation/PostCreation';
import Post from './_Components/Post/Post';
import { PostType } from './_interfaces/posts.types';

type Props = {
  posts: PostType[];
};

export default function ClientHome({ posts }: Props) {
  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', py: 4 }}>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <PostCreation />
          {posts.map((post) => (
            <Post key={post.id} postDetails={post} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
