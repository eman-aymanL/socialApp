import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';

export const myStore=configureStore({
    reducer:{
        authReducer
    }
});

export type StoreType =ReturnType<typeof myStore.getState>