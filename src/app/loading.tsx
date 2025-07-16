'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{   height: '100vh',   bgcolor: '#f3f1f5',   display: 'flex',   flexDirection: 'column',   justifyContent: 'center',   alignItems: 'center', }}
    >
      <CircularProgress size={50} sx={{ color: '#a774be', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Loading, please wait...
      </Typography>
    </Box>
  );
}
