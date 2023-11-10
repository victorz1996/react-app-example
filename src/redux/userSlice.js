import { createSlice } from "@reduxjs/toolkit";
let initialState;

const keepSession = () => {
  try {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    if (userSession) {
      initialState = {
        email: userSession.email,
      };
      return;
    }
    initialState = {
      email: "",
    };
  } catch (error) {
    console.error(error);
  }
};
keepSession();

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { email } = action.payload;
      state.email = email;
    },
    removeUser: (state) => {
      state.email = "";
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
