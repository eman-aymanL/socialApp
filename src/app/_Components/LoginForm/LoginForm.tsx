'use client'

import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper, InputAdornment, IconButton} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as Yup from 'yup';
import {useFormik} from "formik";
import {FormValuesType} from './LoginForm.types'
import axios from 'axios'
import {useRouter} from 'next/navigation'
import { setUserToken } from '@/lib/redux/authSlice';
import { useDispatch } from 'react-redux';
import { myStore } from './../../../lib/redux/reduxStore';
import Cookies from 'js-cookie'

type LoginResponseType ={message:string;token:string}

export default function LoginForm() {
     const [showPassword, setShowPassword] = useState(false);
      const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };
      const router=useRouter();
      const dispatch =useDispatch<typeof myStore.dispatch>()
      const [errorMessage, setErrorMessage] = useState('');

      function handleSubmit(values: FormValuesType){
        console.log('values',values);
        axios.post<LoginResponseType>('https://linked-posts.routemisr.com/users/signin',values,{
          headers:{
            'Content-Type': 'application/json',
          }
        })
        .then(function(res){
          Cookies.set('userToken',res.data.token)
          dispatch(setUserToken(res.data.token));
          setTimeout(() => {
  router.push('/');
  setTimeout(() => window.location.reload(), 1500);
}, 300);

        })
        .catch(function(err) {
  console.log('err', err);
  if (err.response?.data?.message) {
    setErrorMessage(err.response.data.message);
  } else {
    setErrorMessage("Something went wrong. Please try again.");
  }
});
      }





      const user: FormValuesType={
        email:'',
        password:''
      }
   
     const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
      const loginFormik = useFormik({
        initialValues: user,
          validationSchema: loginSchema,
        onSubmit : handleSubmit,
      })

  return (
        <Box id="hero" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212',
        }}>
          <Paper elevation={6} sx={{   padding: 4,   width: 350,   borderRadius: 3,   backgroundColor: '#FFFFFF', }}>
              <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 3 }}
              >Login Now</Typography>
              <form onSubmit={loginFormik.handleSubmit}>
              <TextField value={loginFormik.values.email} onBlur={loginFormik.handleBlur}
 name="email" onChange={loginFormik.handleChange} fullWidth label="Email" type="email" variant="outlined" margin="normal" error={Boolean(loginFormik.touched.email && loginFormik.errors.email)}
  helperText={loginFormik.touched.email && loginFormik.errors.email}
                required/>
              <TextField onBlur={loginFormik.handleBlur}   value={loginFormik.values.password}   name="password"   onChange={loginFormik.handleChange}  
               fullWidth   label="Password"   type={showPassword ? 'text' : 'password'}   variant="outlined"   margin="normal"  
                error={Boolean(loginFormik.touched.password && loginFormik.errors.password)}
  helperText={loginFormik.touched.password && loginFormik.errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}/>
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, backgroundColor: '#A774BE', '&:hover': { backgroundColor: '#9254a3' } }}>Login</Button>
              {errorMessage && (
  <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
    {errorMessage}
  </Typography>
)}

              <Typography mt={2} textAlign="center">
  Don’t have an account?{' '}
  <span
    onClick={() => router.push('/signin')}
    style={{ color: '#A774BE', cursor: 'pointer', textDecoration: 'underline' }}
  >
    Register Now
  </span>
</Typography>

            </form>
          </Paper>
        </Box>
  )
}
