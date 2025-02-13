import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `counter`, handled by `counterReducer`
  },
})