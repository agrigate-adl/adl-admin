// import { configureStore } from "@reduxjs/toolkit";

 import usersReducer from "../features/userSlice"

// export default configureStore({
//     reducer:{
//         user: userReducer,
//     },
// });

import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const userReducer = persistReducer(persistConfig, usersReducer)

export const store = configureStore({
  reducer: userReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)