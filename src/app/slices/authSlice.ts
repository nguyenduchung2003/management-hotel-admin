import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Staff } from '@/api/admin'

export interface AuthState {
  token: string | null
  staff: Staff | null
}

const STORAGE_KEY = 'hs_admin_auth'

function load(): AuthState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthState>
      if (typeof parsed.token === 'string' && parsed.staff) {
        return { token: parsed.token, staff: parsed.staff }
      }
    }
  } catch {
    // localStorage bị chặn hoặc dữ liệu hỏng → coi như chưa đăng nhập
  }
  return { token: null, staff: null }
}

export function persistAuth(state: AuthState): void {
  try {
    if (state.token) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // bỏ qua
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: load,
  reducers: {
    loggedIn(state, action: PayloadAction<{ token: string; staff: Staff }>) {
      state.token = action.payload.token
      state.staff = action.payload.staff
    },
    loggedOut(state) {
      state.token = null
      state.staff = null
    },
  },
})

export const { loggedIn, loggedOut } = authSlice.actions
export default authSlice.reducer
