'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Avatar, Box, Button, Typography, Paper, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import UserPosts from '../_Components/UserPosts/UserPosts';
import PostCreation from '../_Components/PostCreation/PostCreation';
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';

const StyledPaper = styled(Paper)(({ theme }) => ({ padding: theme.spacing(5), maxWidth: 900, margin: 'auto', 
  backgroundColor: 'white', borderRadius: theme.spacing(3), boxShadow: theme.shadows[5],
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({ width: theme.spacing(18), height: theme.spacing(18), marginBottom: theme.spacing(3), 
  border: `5px solid #a774be`, transition: 'transform 0.3s ease', cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', },
}));

const PurpleButton = styled(Button)({
  backgroundColor: '#a774be',
  color: 'white',
  '&:hover': {
    backgroundColor: '#9254a3',
  },
});

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const token = Cookies.get('userToken');
  
  if (!token) {
      router.push('/login');
    }
  const fetchProfile = async () => {
    try {
      const token = Cookies.get('userToken');
      const res = await fetch('https://linked-posts.routemisr.com/users/profile-data', {
        headers: { token: token || '' },
      });
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    const token = Cookies.get('userToken');

    try {
      const res = await fetch('https://linked-posts.routemisr.com/users/upload-photo', {
        method: 'PUT',
        headers: { token: token || '' },
        body: formData,
      });

      const data = await res.json();

      if (data.message === 'success') {
  toast.success('Photo changed successfully!');
  window.location.reload();
} else {
  toast.error('Upload failed: ' + data.message);
}
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('userToken');
    router.push('/login');
  };

  const refetchPosts = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <StyledPaper>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} textAlign="center">
            <ProfileAvatar src={user?.photo} alt={user?.name} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-photo"
              onChange={handleUpload}
            />
            <label htmlFor="upload-photo">
              <PurpleButton component="span" size="small" sx={{ mt: 1 }}>
                Change Photo
              </PurpleButton>
            </label>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {user?.name}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1" color="text.secondary" sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                Email: {user?.email}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                Gender: {user?.gender}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                Date of Birth: {user?.dateOfBirth}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                Joined: {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <PurpleButton onClick={() => router.push('/Forgotpass')}>
                Change Password
              </PurpleButton>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <PostCreation onPostCreated={refetchPosts} />
        <UserPosts refreshTrigger={refresh} />
      </Box>
    </Box>
  );
}
