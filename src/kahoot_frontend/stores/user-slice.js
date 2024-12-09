import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principal: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPrincipal: (state, action) => {
      state.principal = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { setPrincipal } = actions;
export default reducer;
