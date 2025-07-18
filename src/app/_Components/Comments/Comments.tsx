'use client';
import React, { useMemo, useState } from 'react';
import {Avatar,Box,TextField,Typography,Button,} from '@mui/material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; 
import Link from 'next/link';
import { CommentType, PostType } from '@/app/_interfaces/posts.types';

type CommentsProps = {
  postDetails: PostType;
  displayAllComments?: boolean;
};

interface TokenPayload {
  _id: string;
}

export default function Comments({ postDetails, displayAllComments = false }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(postDetails.comments || []);

  const token = Cookies.get('userToken') || null;

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded._id;
    } catch {
      return null;
    }
  }, [token]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch('https://linked-posts.routemisr.com/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token || '',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          post: postDetails._id,
        }),
      });

      const data = await res.json();

      if (data.message === 'success') {
        setComments((prev) => [...prev, data.comments[0]]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Create comment error:', err);
    }
  };

  function SingleComment({ comment }: { comment: CommentType }) {
    if (!comment || !comment.commentCreator) return null; 

  const photoSrc =
    comment.commentCreator?.photo?.includes('undefined') || !comment.commentCreator.photo
      ? '/default-avatar.png'
      : comment.commentCreator.photo;

    return (
      <Box sx={{ px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Avatar
            src={
              comment.commentCreator.photo?.includes('undefined')
                ? '/default-avatar.png'
                : comment.commentCreator.photo
            }
            sx={{ width: 32, height: 32 }}
            alt={comment.commentCreator.name}
          />
          <Box sx={{ bgcolor: '#f0f2f5', p: 1.2, borderRadius: 2, maxWidth: '80%' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {comment.commentCreator.name}
            </Typography>
            <Typography variant="body2">{comment.content}</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const firstComment = comments?.[0];
  const validComments = comments?.filter((c) => c && c.commentCreator);

  return (
    <>
      <Box
        sx={{display: 'flex',alignItems: 'center',px: 2,py: 1.5,  gap: 1,borderBottom: '1px solid #eee', }}>
        <Avatar src="/my-avatar.png" sx={{ width: 32, height: 32 }} alt="Your Avatar" />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          size="small"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleCreateComment();
            }
          }}
          InputProps={{sx: {bgcolor: '#f0f2f5',borderRadius: 5,fontSize: 14,'& .MuiOutlinedInput-notchedOutline': { border: 'none' },},}}/>
        <Button variant="contained" sx={{ backgroundColor: '#a774be', '&:hover': { backgroundColor: '#9254a3' } }} onClick={handleCreateComment} disabled={!newComment.trim()}> Post </Button>
      </Box>

      {displayAllComments
        ? validComments.map((comment) => <SingleComment key={comment._id} comment={comment} />)
        : firstComment && <SingleComment comment={firstComment} />}
      {!displayAllComments && validComments.length > 1 && (
        <Link href={`/post/${postDetails._id}`}>
          <Typography sx={{px: 2,py: 1,cursor: 'pointer',color: '#8E44AD',fontWeight: 'bold'}}>View more Comments...</Typography>
        </Link>
      )}
    </>
  );
}
