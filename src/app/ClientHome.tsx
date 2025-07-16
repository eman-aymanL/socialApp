'use client';

import React from 'react';
import { Box } from '@mui/material';
import PostCreation from './_Components/PostCreation/PostCreation';
import Post from './_Components/Post/Post';
import { PostType } from './_interfaces/posts.types';
import { Grid } from '@mui/material';


type Props = {
  posts: PostType[];
};

export default function ClientHome({ posts }: Props) {
  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', py: 4 }}>
      <Grid container justifyContent="center">
        <Grid
          item={true}
          xs={12}
          sm={8}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <PostCreation onPostCreated={function (): void {
            throw new Error('Function not implemented.');
          } } />
          {posts.map((post) => (
            <Post key={post.id} postDetails={post} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
