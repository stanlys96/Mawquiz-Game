import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principal: "",
  nickname: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    settingPrincipal: (state, action) => {
      state.principal = action.payload;
    },
    settingNickname: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { settingPrincipal, settingNickname } = actions;
export default reducer;
