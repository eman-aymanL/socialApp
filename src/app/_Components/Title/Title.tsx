'use client'

import { StoreType } from '@/lib/redux/reduxStore';
import React from 'react'
import { useSelector } from 'react-redux';

export default function Title() {
     const res=useSelector((store:StoreType) => store.authReducer)
  return (
    <div>User Name:{res.toString()}</div>
  )
}
