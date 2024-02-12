import { createSlice } from "@reduxjs/toolkit";
const recordingSlice=createSlice({
    name:"recording",
    initialState:{
        speech:""
    },
    reducers:{
        addSpeech:(state,action)=>{
            state.speech=action.payload;
        },
    }
})

export const {addSpeech}=recordingSlice.actions;
export default recordingSlice.reducer