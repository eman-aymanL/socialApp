'use client';
import * as React from 'react';
import { Card, CardHeader, CardContent, CardActions, Box, Avatar, IconButton, Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import { PostType } from '@/app/_interfaces/posts.types';
import Image from 'next/image';
import Comments from '../Comments/Comments';


type PostProps = {
  postDetails: PostType;
  hasMoreComments?: boolean,
};

export default function Post({ postDetails , hasMoreComments= false}: PostProps) {
  const firstComment = postDetails.comments?.[0];

  console.log('hena', hasMoreComments)



  return (
    
    <Card sx={{ width: '100%', boxShadow: 1, borderRadius: 2, mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500], width: 40, height: 40, overflow: 'hidden' }}>
            <Image
              width={40}
              height={40}
              src={postDetails.user.photo}
              alt={postDetails.user.name}
              style={{ objectFit: 'cover' }}
            />
          </Avatar>
        }
        action={<IconButton><MoreVertIcon /></IconButton>}
        title={<Typography fontWeight="bold">{postDetails.user.name}</Typography>}
        subheader={<Typography variant="caption">{postDetails.createdAt}</Typography>}
        sx={{ alignItems: 'flex-start', pb: 0 }}
      />

      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {firstComment.content}
        </Typography>
      </CardContent>

      {!!postDetails.image && (
        <Box
          component="img"
          src={postDetails.image}
          alt="Post image"
          sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', borderRadius: 1, mt: 1,
          }}
        />
      )}

      <CardActions
        disableSpacing
        sx={{ justifyContent: 'space-around', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', px: 2,
        }}
      >
        <IconButton><FavoriteIcon /></IconButton>
        <IconButton><CommentIcon /></IconButton>
        <IconButton><ShareIcon /></IconButton>
      </CardActions>




        <Comments postDetails={postDetails} displayAllComments={hasMoreComments}/>
  
    </Card>
  );
}