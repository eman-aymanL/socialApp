'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Avatar, Box, Button, Typography, Paper, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import UserPosts from '../_Components/UserPosts/UserPosts';
import PostCreation from '../_Components/PostCreation/PostCreation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 900,
  margin: 'auto',
  backgroundColor: 'white',
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[5],
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(18),
  height: theme.spacing(18),
  marginBottom: theme.spacing(3),
  border: `5px solid #a774be`,
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': { transform: 'scale(1.05)' },
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
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

    try {
      const res = await fetch('https://linked-posts.routemisr.com/users/upload-photo', {
        method: 'PUT',
        headers: {
          token: token || '',
        },
        body: formData,
      });

      const data = await res.json();

      if (data.message === 'success') {
        toast.success('Photo changed successfully!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong.');
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box
  sx={{
    width: { xs: '100%', md: '33.33%' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}
>

            <ProfileAvatar src={user?.photo} alt={user?.name} onClick={() => inputRef.current?.click()} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={inputRef}
              onChange={handleUpload}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: '#a774be',
                color: 'white',
                '&:hover': { backgroundColor: '#9254a3' },
              }}
              onClick={() => inputRef.current?.click()}
            >
              Change Photo
            </Button>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
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
          </Box>
        </Box>
      </StyledPaper>

      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <PostCreation onPostCreated={refetchPosts} />
        <UserPosts refreshTrigger={refresh} />
      </Box>

      <ToastContainer position="top-center" />
    </Box>
  );
}
