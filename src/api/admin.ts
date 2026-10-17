import type { RatePlan, Room } from '@/types/homestay'
import type {
  Addon,
  AdminCreateReservationInput,
  CalendarData,
  CancelReservationInput,
  PagedResult,
  Promotion,
  QuoteRequest,
  QuoteResult,
  Reservation,
  ReservationListQuery,
  ReservationStats,
  UpdateReservationInput,
} from '@/types/reservation'
import { cleanParams, http } from './client'

// Mỗi hàm = một endpoint của mock-api (xem mock-api/src/routes.ts). Khi có BE thật, giữ nguyên chữ ký.

export interface Staff {
  username: string
  name: string
  role: 'admin'
}

export interface LoginResult {
  token: string
  staff: Staff
}

const data = <T>(response: { data: T }) => response.data

export const login = (username: string, password: string) =>
  http.post<LoginResult>('/admin/login', { username, password }).then(data)

export const fetchMe = () => http.get<Staff>('/admin/me').then(data)

export const fetchRooms = () => http.get<Room[]>('/admin/rooms').then(data)
export const fetchRatePlans = () => http.get<RatePlan[]>('/admin/rate-plans').then(data)
export const fetchAddons = () => http.get<Addon[]>('/admin/addons').then(data)
export const fetchPromotions = () => http.get<Promotion[]>('/admin/promotions').then(data)

export const fetchReservations = (query: ReservationListQuery) =>
  http
    .get<PagedResult<Reservation>>('/admin/reservations', { params: cleanParams(query) })
    .then(data)

export const fetchReservation = (code: string) =>
  http.get<Reservation>(`/admin/reservations/${encodeURIComponent(code)}`).then(data)

export const createReservation = (input: AdminCreateReservationInput) =>
  http.post<Reservation>('/admin/reservations', input).then(data)

export const updateReservation = (code: string, input: UpdateReservationInput) =>
  http.patch<Reservation>(`/admin/reservations/${encodeURIComponent(code)}`, input).then(data)

const action = (code: string, name: string, body?: unknown) =>
  http.post<Reservation>(`/admin/reservations/${encodeURIComponent(code)}/${name}`, body).then(data)

export const confirmPayment = (code: string) => action(code, 'confirm-payment')
export const checkIn = (code: string) => action(code, 'check-in')
export const checkOut = (code: string) => action(code, 'check-out')
export const markNoShow = (code: string) => action(code, 'no-show')
export const cancelReservation = (code: string, input: CancelReservationInput) =>
  action(code, 'cancel', input)

export const fetchQuote = (request: QuoteRequest) =>
  http.post<QuoteResult>('/admin/quote', request).then(data)

export const fetchStats = (date?: string) =>
  http.get<ReservationStats>('/admin/stats', { params: cleanParams({ date }) }).then(data)

export const fetchCalendar = (from: string, days: number) =>
  http.get<CalendarData>('/admin/calendar', { params: { from, days } }).then(data)
