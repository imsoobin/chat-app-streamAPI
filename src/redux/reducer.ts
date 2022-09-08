import { createSlice } from "@reduxjs/toolkit";

interface Menu {
  isToggle?: boolean;
  showUser?: boolean;
  isOpen?: boolean
}

const initialState: Menu = {
  isToggle: false,
  showUser: false,
  isOpen: false
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
    toggleModal: (state, action) => {
      state.isOpen = action.payload
    }
  },
});

export const { toggleMenu, showUserEdit, setResize, toggleModal } = actionSlice.actions;
export default actionSlice.reducer;
