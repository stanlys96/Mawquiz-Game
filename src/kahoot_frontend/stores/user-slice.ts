import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principal: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    settingPrincipal: (state, action) => {
      state.principal = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { settingPrincipal } = actions;
export default reducer;
