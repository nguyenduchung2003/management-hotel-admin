import { Tag } from 'antd'
import type { PaymentStatus, ReservationStatus } from '@/types/reservation'
import { PAYMENT_STATUS_LABELS, STATUS_LABELS } from '@/utils/reservationLabels'

export function StatusTag({ status }: { status: ReservationStatus }) {
  const { label, color } = STATUS_LABELS[status]
  return <Tag color={color}>{label}</Tag>
}

export function PaymentTag({ status }: { status: PaymentStatus }) {
  const { label, color } = PAYMENT_STATUS_LABELS[status]
  return <Tag color={color}>{label}</Tag>
}
