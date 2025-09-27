import { createSlice } from "@reduxjs/toolkit";
// import React from "react";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});


//Action
export const { setUser } = userSlice.actions;

//Reducer
export default userSlice.reducer;