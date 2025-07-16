'use client'

import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FormRegValuesType } from './SigninForm.types';
import { useRouter } from 'next/navigation'

const isAtLeast18 = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  return age > 18 || (age === 18 && m >= 0);
};

const registerSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),

  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please re-enter your password'),

  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .test('is-18', 'You must be at least 18 years old', value => {
      if (!value) return false;
      return isAtLeast18(value);
    }),

  gender: Yup.string()
    .oneOf(['male', 'female'], 'Please select your gender')
    .required('Gender is required'),
});


export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();


  const user: FormRegValuesType = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
    dateOfBirth: '',
    gender: ''
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleRePasswordVisibility = () => setShowRePassword(prev => !prev);

  function handleSubmit(values: FormRegValuesType) {
    axios.post('https://linked-posts.routemisr.com/users/signup', values, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      setSuccessMessage('Registration successful! You can now login.');
      setErrorMessage('');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    })
    .catch(err => {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
        
      } else {
        setErrorMessage('Something went wrong. Please try again.');
        
      }
      setSuccessMessage('');
    });
  }

  const registerFormik = useFormik({
    initialValues: user,
    validationSchema: registerSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Box id='hero' sx={{   display: 'flex',   justifyContent: 'center',   alignItems: 'center',   height: '100vh',}}>
<Paper elevation={6} sx={{ padding: 4, width: 400, borderRadius: 3, backgroundColor: 'white',  }}>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
          Sign Up
        </Typography>

        <form onSubmit={registerFormik.handleSubmit}>
          <TextField label="Full Name" name="name" value={registerFormik.values.name} onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} fullWidth margin="normal" variant="outlined" error={Boolean(registerFormik.touched.name && registerFormik.errors.name)} helperText={registerFormik.touched.name && registerFormik.errors.name} InputLabelProps={{ style: { } }} InputProps={{ style: { } }}
          />

          <TextField label="Email" name="email" type="email" value={registerFormik.values.email} onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} fullWidth margin="normal" variant="outlined" error={Boolean(registerFormik.touched.email && registerFormik.errors.email)} helperText={registerFormik.touched.email && registerFormik.errors.email} InputLabelProps={{ style: { } }} InputProps={{ style: { } }}
          />

          <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} value={registerFormik.values.password} onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} fullWidth margin="normal" variant="outlined" error={Boolean(registerFormik.touched.password && registerFormik.errors.password)} helperText={registerFormik.touched.password && registerFormik.errors.password} InputLabelProps={{ style: { } }} InputProps={{   style: { },   endAdornment: (     <InputAdornment position="end">       <IconButton onClick={togglePasswordVisibility} edge="end">         {showPassword ? <VisibilityOff /> : <Visibility />}       </IconButton>     </InputAdornment>   ) }}
          />

          <TextField label="Re-enter Password" name="rePassword" type={showRePassword ? 'text' : 'password'} value={registerFormik.values.rePassword} onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} fullWidth margin="normal" variant="outlined" error={Boolean(registerFormik.touched.rePassword && registerFormik.errors.rePassword)} helperText={registerFormik.touched.rePassword && registerFormik.errors.rePassword} InputLabelProps={{ style: { } }} InputProps={{   style: { },   endAdornment: (     <InputAdornment position="end">       <IconButton onClick={toggleRePasswordVisibility} edge="end">         {showRePassword ? <VisibilityOff /> : <Visibility />}       </IconButton>     </InputAdornment>   ) }}
          />

          <TextField label="Date of Birth" name="dateOfBirth" type="date" value={registerFormik.values.dateOfBirth} onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} fullWidth margin="normal" variant="outlined" error={Boolean(registerFormik.touched.dateOfBirth && registerFormik.errors.dateOfBirth)} helperText={registerFormik.touched.dateOfBirth && registerFormik.errors.dateOfBirth} InputLabelProps={{ shrink: true, style: { } }} InputProps={{ style: { } }}
          />

          <FormControl sx={{ mt: 2 }} component="fieldset"> <FormLabel component="legend" sx={{ }}>Gender</FormLabel> <RadioGroup   row   name="gender"   value={registerFormik.values.gender}   onChange={registerFormik.handleChange} >   <FormControlLabel value="female" control={<Radio />} label="Female" />   <FormControlLabel value="male" control={<Radio />} label="Male" /> </RadioGroup> {registerFormik.touched.gender && registerFormik.errors.gender && (   <Typography color="error" variant="caption">     {registerFormik.errors.gender}   </Typography> )}
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, backgroundColor: '#A774BE', '&:hover': { backgroundColor: '#9254a3' } }}
          > Sign Up
          </Button>

          {successMessage && ( <Typography sx={{ color: 'lightgreen', textAlign: 'center', mt: 2 }}>   {successMessage} </Typography>
          )}

          {errorMessage && ( <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>   {errorMessage} </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
