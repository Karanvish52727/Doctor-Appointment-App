import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
// import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSlice } from "./features/userSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
  },
});

