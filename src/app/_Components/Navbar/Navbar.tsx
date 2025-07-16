'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('userToken');
    if (token) {
      setIsLoggedIn(true);
      const fetchProfile = async () => {
        try {
          const res = await fetch('https://linked-posts.routemisr.com/users/profile-data', {
            headers: { token },
          });
          const data = await res.json();
          setUserPhoto(data.user?.photo);
        } catch (err) {
          console.error('Failed to load user photo', err);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('userToken');
    router.push('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ bgcolor: '#8e44ad' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: isLoggedIn ? 'pointer' : 'default', fontWeight: 'bold' }}
            onClick={() => {
              if (isLoggedIn) router.push('/');
            }}
          >
            LinkedPosts
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Button color="inherit" onClick={() => router.push('/')}>
                  Home
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
                <IconButton onClick={() => router.push('/Profile')}>
                  <Avatar
                    src={userPhoto || '/default-user.png'}
                    alt="profile"
                    sx={{ width: 35, height: 35 }}
                  />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => router.push('/signin')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
