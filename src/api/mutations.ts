import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import type { Reservation } from '@/types/reservation'
import * as api from './admin'
import { keys } from './queries'

/** Các thao tác trên một đặt phòng; sau mỗi thao tác làm mới danh sách, thống kê và lịch. */
export function useReservationActions() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const done = (text: string) => (reservation: Reservation) => {
    queryClient.setQueryData(keys.detail(reservation.code), reservation)
    void queryClient.invalidateQueries({ queryKey: keys.reservations })
    void queryClient.invalidateQueries({ queryKey: keys.stats })
    void queryClient.invalidateQueries({ queryKey: keys.calendar })
    void message.success(text)
  }
  const failed = (error: Error) => {
    void message.error(error.message)
  }

  const confirmPayment = useMutation({
    mutationFn: api.confirmPayment,
    onSuccess: done('Đã xác nhận thanh toán.'),
    onError: failed,
  })
  const checkIn = useMutation({
    mutationFn: api.checkIn,
    onSuccess: done('Đã nhận phòng cho khách.'),
    onError: failed,
  })
  const checkOut = useMutation({
    mutationFn: api.checkOut,
    onSuccess: done('Đã trả phòng.'),
    onError: failed,
  })
  const noShow = useMutation({
    mutationFn: api.markNoShow,
    onSuccess: done('Đã đánh dấu khách không đến.'),
    onError: failed,
  })
  const cancel = useMutation({
    mutationFn: (vars: { code: string; reason: string; refund: boolean }) =>
      api.cancelReservation(vars.code, { reason: vars.reason, refund: vars.refund }),
    onSuccess: done('Đã huỷ đặt phòng.'),
    onError: failed,
  })
  const update = useMutation({
    mutationFn: (vars: { code: string; input: Parameters<typeof api.updateReservation>[1] }) =>
      api.updateReservation(vars.code, vars.input),
    onSuccess: done('Đã lưu thay đổi.'),
    onError: failed,
  })

  return { confirmPayment, checkIn, checkOut, noShow, cancel, update }
}

export function useCreateReservation() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: api.createReservation,
    onSuccess: (reservation) => {
      queryClient.setQueryData(keys.detail(reservation.code), reservation)
      void queryClient.invalidateQueries({ queryKey: keys.reservations })
      void queryClient.invalidateQueries({ queryKey: keys.stats })
      void queryClient.invalidateQueries({ queryKey: keys.calendar })
      void message.success(`Đã tạo đặt phòng ${reservation.code}.`)
    },
    onError: (error: Error) => {
      void message.error(error.message)
    },
  })
}
