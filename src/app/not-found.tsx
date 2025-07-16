'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  return (
    <Box sx={{   height: '100vh',   bgcolor: '#fff0f7',   display: 'flex',   flexDirection: 'column',   justifyContent: 'center',   alignItems: 'center',   textAlign: 'center',   px: 2, }}
    >
      <Typography variant="h3" sx={{ color: '#a774be', fontWeight: 'bold', mb: 2 }}>
        Oops!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Something went wrong. Please try again later.
      </Typography>
      <Button variant="contained" sx={{ bgcolor: '#a774be', '&:hover': { bgcolor: '#9254a3' } }} onClick={() => router.refresh()}>Retry
      </Button>
    </Box>
  );
}
