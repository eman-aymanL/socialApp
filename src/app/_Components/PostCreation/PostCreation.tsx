'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Modal, TextField, Typography, Paper, Divider,
} from '@mui/material';
import Upload from '../Upload/Upload';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';



type Props = {
  onPostCreated: () => void;
};

export default function PostCreation({ onPostCreated }: Props) {
  const [open, setOpen] = useState(false);
  const myRef = useRef<HTMLInputElement>(null);
  const captionInput = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    myRef.current?.blur();
  };

  const handleClose = () => setOpen(false);

  async function createPost() {
    const caption = captionInput.current?.value?.trim();
    const image = imageInputRef.current?.files?.[0];

    if (!caption && !image) {
      toast.error('Please add a caption or an image.');
      return;
    }

    const payload = new FormData();
    if (caption) payload.append('body', caption);
    if (image) payload.append('image', image);

    try {
      const { data } = await axios.post(
        'https://linked-posts.routemisr.com/posts',
        payload,
        {
          headers: {
            token: Cookie.get('userToken')!,
          },
        }
      );

      if (data.message === 'success') {
        toast.success('Post created successfully!');
        setOpen(false);
        onPostCreated(); 
        if (captionInput.current) captionInput.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
      } else {
        toast.error('Failed: ' + data.message);
      }
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || 'Failed to create post.');
  } else {
    toast.error('Unexpected error occurred.');
  }
}

  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <TextField inputRef={myRef} onFocus={handleOpen} fullWidth multiline placeholder="What's on your mind?" sx={{   backgroundColor: '#f0f2f5',   borderRadius: 2,   '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, }}
        />
        <Divider sx={{ my: 2 }} />
        <Upload />
      </Paper>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 }, bgcolor: '#E0E0E0', boxShadow: 24, p: 3, borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>   Create Post </Typography>
          <TextField inputRef={captionInput} fullWidth multiline minRows={3} placeholder="What's on your mind?" sx={{   backgroundColor: '#f0f2f5',   borderRadius: 2,   '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, }}
          />

          <Box mt={2}>
            <Upload imageInputRef={imageInputRef} />
          </Box>

          <Box mt={3} textAlign="right">
            <Button onClick={createPost} variant="contained" sx={{ bgcolor: '#a774be' }}>Post</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
