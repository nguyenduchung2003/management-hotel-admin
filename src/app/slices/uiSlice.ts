import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  siderCollapsed: boolean
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { siderCollapsed: false } as UiState,
  reducers: {
    setSiderCollapsed(state, action: PayloadAction<boolean>) {
      state.siderCollapsed = action.payload
    },
  },
})

export const { setSiderCollapsed } = uiSlice.actions
export default uiSlice.reducer
