import { createSlice } from "@reduxjs/toolkit";

interface Menu {
  isToggle?: boolean;
  showUser?: boolean;
}

const initialState: Menu = {
  isToggle: false,
  showUser: false,
};

export const actionSlice = createSlice({
  name: "actionEvt",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isToggle = !state.isToggle;
    },
    setResize: (state, action) => {
      state.isToggle = action.payload;
    },
    showUserEdit: (state, action) => {
      state.showUser = action.payload;
    },
  },
});

export const { toggleMenu, showUserEdit, setResize } = actionSlice.actions;
export default actionSlice.reducer;
