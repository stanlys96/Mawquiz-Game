import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principal: "",
  nickname: "",
  currentPickedKahoot: {},
  currentUniquePlayers: [],
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
    settingKahoot: (state, action) => {
      state.currentPickedKahoot = action.payload;
    },
    settingUniquePlayers: (state, action) => {
      state.currentUniquePlayers = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const {
  settingPrincipal,
  settingNickname,
  settingKahoot,
  settingUniquePlayers,
} = actions;
export default reducer;
