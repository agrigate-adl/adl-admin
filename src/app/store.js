import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import { combineReducers } from "redux";

import usersReducer from "../features/userSlice"; // Your existing user reducer
import packageReducer from "../features/packageSlice"; // The new package reducer

// Persistence configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: usersReducer,
  package: packageReducer, // Add the package reducer here
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and export the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

// Export the persistor
export const persistor = persistStore(store);
