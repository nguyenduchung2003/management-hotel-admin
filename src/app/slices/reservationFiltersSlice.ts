import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ReservationListQuery,
  ReservationSortField,
  SortOrder,
} from '@/types/reservation'

// Bộ lọc danh sách đặt phòng nằm trong Redux để vào xem chi tiết rồi quay lại vẫn giữ nguyên.

export const DEFAULT_QUERY: ReservationListQuery = {
  page: 1,
  pageSize: 20,
  dateField: 'checkIn',
  sortField: 'createdAt',
  sortOrder: 'desc',
}

type Filters = Partial<
  Omit<ReservationListQuery, 'page' | 'pageSize' | 'sortField' | 'sortOrder'>
>

const slice = createSlice({
  name: 'reservationFilters',
  initialState: { query: DEFAULT_QUERY },
  reducers: {
    /** Đổi điều kiện lọc → quay về trang 1. Truyền `undefined` để bỏ một điều kiện. */
    setFilters(state, action: PayloadAction<Filters>) {
      state.query = { ...state.query, ...action.payload, page: 1 }
    },
    setPage(state, action: PayloadAction<{ page: number; pageSize: number }>) {
      state.query.page = action.payload.page
      state.query.pageSize = action.payload.pageSize
    },
    setSort(state, action: PayloadAction<{ field: ReservationSortField; order: SortOrder }>) {
      state.query.sortField = action.payload.field
      state.query.sortOrder = action.payload.order
      state.query.page = 1
    },
    resetFilters() {
      return { query: DEFAULT_QUERY }
    },
    /** Tìm nhanh từ thanh trên cùng: xoá mọi bộ lọc khác để không ẩn kết quả. */
    quickSearch(_state, action: PayloadAction<string>) {
      return { query: { ...DEFAULT_QUERY, keyword: action.payload || undefined } }
    },
  },
})

export const { setFilters, setPage, setSort, resetFilters, quickSearch } = slice.actions
export default slice.reducer
