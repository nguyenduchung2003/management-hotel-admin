import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query'
import type { QuoteRequest, ReservationListQuery } from '@/types/reservation'
import * as api from './admin'

export const keys = {
  reservations: ['reservations'] as const,
  list: (query: ReservationListQuery) => ['reservations', 'list', query] as const,
  detail: (code: string) => ['reservations', 'detail', code] as const,
  stats: ['stats'] as const,
  calendar: ['calendar'] as const,
}

export function useReservationList(query: ReservationListQuery) {
  return useQuery({
    queryKey: keys.list(query),
    queryFn: () => api.fetchReservations(query),
    placeholderData: keepPreviousData,
  })
}

export function useReservation(code: string) {
  return useQuery({
    queryKey: keys.detail(code),
    queryFn: () => api.fetchReservation(code),
  })
}

export function useStats() {
  return useQuery({
    queryKey: [...keys.stats, 'today'],
    queryFn: () => api.fetchStats(),
    refetchInterval: 30_000,
  })
}

export function useCalendar(from: string, days: number) {
  return useQuery({
    queryKey: [...keys.calendar, from, days],
    queryFn: () => api.fetchCalendar(from, days),
    placeholderData: keepPreviousData,
  })
}

// Danh mục gần như không đổi trong phiên làm việc.
const catalog = { staleTime: Infinity } as const

export const useRooms = () => useQuery({ queryKey: ['rooms'], queryFn: api.fetchRooms, ...catalog })
export const useRatePlans = () =>
  useQuery({ queryKey: ['rate-plans'], queryFn: api.fetchRatePlans, ...catalog })
export const useAddons = () => useQuery({ queryKey: ['addons'], queryFn: api.fetchAddons, ...catalog })

/** `request = null` → chưa đủ thông tin, không gọi API. */
export function useQuote(request: QuoteRequest | null) {
  return useQuery({
    queryKey: ['quote', request],
    queryFn: request ? () => api.fetchQuote(request) : skipToken,
    placeholderData: keepPreviousData,
  })
}
