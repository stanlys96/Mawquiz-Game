import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principal: "",
  nickname: "",
  currentPickedKahoot: {},
  currentUniquePlayers: [],
  currentQuestions: [],
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
    settingQuestions: (state, action) => {
      state.currentQuestions = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const {
  settingPrincipal,
  settingNickname,
  settingKahoot,
  settingUniquePlayers,
  settingQuestions,
} = actions;
export default reducer;
