'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useRouter} from 'next/navigation'


export default function ChangePassword() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = Cookies.get('userToken'); 
  const router=useRouter();



  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('New password is required'),
    }),



    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.patch(
          'https://linked-posts.routemisr.com/users/change-password',
          {
            password: values.password,
            newPassword: values.newPassword,
          },
          {
            headers: {
              token: token || '',
              'Content-Type': 'application/json',
            },
          }
        );
        
        setSuccessMessage('Password changed successfully');
        setErrorMessage('');
        Cookies.remove('userToken');
        router.push('/login');
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || 'Something went wrong');
        setSuccessMessage('');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box id="hero" display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#121212">
      <Paper elevation={6} sx={{ p: 4, width: 350, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Change Password
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            name="password"
            label="Current Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            variant="outlined"
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputLabelProps={{ required: false }}
          />

          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            variant="outlined"
            error={Boolean(formik.touched.newPassword && formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputLabelProps={{ required: false }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#A774BE',
              '&:hover': { backgroundColor: '#9254a3' },
            }}
            disabled={formik.isSubmitting}
          >
            Change Password
          </Button>

          {successMessage && (
            <Typography mt={2} color="green" textAlign="center">
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography mt={2} color="error" textAlign="center">
              {errorMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
