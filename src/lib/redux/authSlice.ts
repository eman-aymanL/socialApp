import { createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
    token: string | null;
}

const initialState: InitialStateType = {
    token: null
}

const authSlice =createSlice({
    name:'auth',
    initialState,
    reducers:{
        clearUserData: function(prevState){
            prevState.token=null;
        },

        setUserToken: function(state, action){
            state.token= action.payload
        }
    }
});
export const {clearUserData, setUserToken} =authSlice.actions
export default authSlice.reducer;