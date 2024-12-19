import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packageData: null,
  error: null,
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackageData: (state, action) => {
      state.packageData = action.payload;
    },
    setPackageError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPackageData, setPackageError } = packageSlice.actions;

export default packageSlice.reducer;
