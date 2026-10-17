import { configureStore } from '@reduxjs/toolkit'
import { registerAuthBridge } from '@/api/client'
import authReducer, { loggedOut, persistAuth } from './slices/authSlice'
import reservationFiltersReducer from './slices/reservationFiltersSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    reservationFilters: reservationFiltersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Lưu phiên đăng nhập khi token đổi.
let lastToken = store.getState().auth.token
store.subscribe(() => {
  const { auth } = store.getState()
  if (auth.token !== lastToken) {
    lastToken = auth.token
    persistAuth(auth)
  }
})

// API client lấy token từ store và tự đăng xuất khi nhận 401.
registerAuthBridge({
  getToken: () => store.getState().auth.token,
  onUnauthorized: () => store.dispatch(loggedOut()),
})
