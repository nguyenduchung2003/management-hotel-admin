import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Input, Result, Skeleton, Tag, Timeline } from 'antd'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useReservationActions } from '@/api/mutations'
import { useReservation } from '@/api/queries'
import { ApiError } from '@/api/client'
import { EditGuestModal } from '@/components/EditGuestModal'
import { PageHeader } from '@/components/PageHeader'
import { QueryError } from '@/components/QueryError'
import { QuoteSummary } from '@/components/QuoteSummary'
import { ReservationActions } from '@/components/ReservationActions'
import { PaymentTag, StatusTag } from '@/components/Tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Reservation, ReservationAction } from '@/types/reservation'
import { isFreeCancel } from '@/utils/reservationRules'
import { ACTION_LABELS, PAYMENT_METHOD_LABELS, SOURCE_LABELS } from '@/utils/reservationLabels'
import { formatDate, formatDateTime, formatStayDate, guestLabel } from '@/utils/stay'

const TIMELINE_COLOR: Record<ReservationAction, string> = {
  created: 'blue',
  updated: 'gray',
  payment_confirmed: 'green',
  checked_in: 'green',
  checked_out: 'gray',
  cancelled: 'red',
  no_show: 'red',
}

/** Tách riêng để `key` đặt lại ô nhập mỗi khi dữ liệu máy chủ đổi (sau khi lưu). */
function InternalNote({ reservation }: { reservation: Reservation }) {
  const actions = useReservationActions()
  const saved = reservation.internalNote ?? ''
  const [value, setValue] = useState(saved)

  return (
    <Card title="Ghi chú nội bộ" extra={<span className="text-xs text-muted">Khách không nhìn thấy</span>}>
      <Input.TextArea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={3}
        maxLength={1000}
        showCount
        placeholder="Ví dụ: Khách VIP, ưu tiên phòng yên tĩnh…"
      />
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={value.trim() === saved}
          loading={actions.update.isPending}
          onClick={() =>
            actions.update.mutate({ code: reservation.code, input: { internalNote: value.trim() } })
          }
        >
          Lưu ghi chú
        </Button>
      </div>
    </Card>
  )
}

function Detail({ reservation: r }: { reservation: Reservation }) {
  const [editOpen, setEditOpen] = useState(false)
  const freeWindow = isFreeCancel(r)

  return (
    <>
      <PageHeader
        backTo="/dat-phong"
        backLabel="Về danh sách đặt phòng"
        title={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {r.code}
            <span className="flex items-center">
              <StatusTag status={r.status} />
              <PaymentTag status={r.paymentStatus} />
            </span>
          </span>
        }
        subtitle={`Tạo lúc ${formatDateTime(r.createdAt)} · Nguồn: ${SOURCE_LABELS[r.source]}`}
        extra={<ReservationActions reservation={r} />}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Card title="Lưu trú">
            <Descriptions
              size="small"
              bordered
              column={{ xs: 1, md: 2 }}
              items={[
                { key: 'room', label: 'Hạng phòng', children: r.roomName },
                {
                  key: 'plan',
                  label: 'Gói giá',
                  children: r.ratePlanName,
                },
                { key: 'in', label: 'Nhận phòng', children: formatStayDate(r.checkIn) },
                { key: 'out', label: 'Trả phòng', children: formatStayDate(r.checkOut) },
                { key: 'nights', label: 'Số đêm', children: r.nights },
                { key: 'guests', label: 'Số khách', children: guestLabel(r.adults, r.children) },
                {
                  key: 'addons',
                  label: 'Dịch vụ thêm',
                  span: { xs: 1, md: 2 },
                  children: r.addons.length ? r.addons.map((a) => a.name).join(', ') : '—',
                },
                {
                  key: 'promo',
                  label: 'Mã ưu đãi',
                  children: r.promoCode ? <Tag color="gold">{r.promoCode}</Tag> : '—',
                },
                {
                  key: 'cancel-until',
                  label: 'Huỷ miễn phí đến',
                  children: r.freeCancelUntil ? (
                    <>
                      {formatDate(r.freeCancelUntil)}{' '}
                      {r.status !== 'cancelled' && (
                        <Tag color={freeWindow ? 'green' : 'default'}>{freeWindow ? 'Còn hạn' : 'Hết hạn'}</Tag>
                      )}
                    </>
                  ) : (
                    'Không hoàn huỷ'
                  ),
                },
                ...(r.cancelReason
                  ? [{ key: 'reason', label: 'Lý do huỷ', span: { xs: 1, md: 2 }, children: r.cancelReason }]
                  : []),
              ]}
            />
          </Card>

          <Card
            title="Khách hàng"
            extra={
              <Button size="small" icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
                Sửa
              </Button>
            }
          >
            <Descriptions
              size="small"
              bordered
              column={{ xs: 1, md: 2 }}
              items={[
                {
                  key: 'name',
                  label: 'Họ và tên',
                  children: `${r.guest.title === 'mr' ? 'Ông' : 'Bà'} ${r.guest.fullName}`,
                },
                { key: 'country', label: 'Quốc gia', children: r.guest.country },
                {
                  key: 'email',
                  label: 'Email',
                  children: <a href={`mailto:${r.guest.email}`}>{r.guest.email}</a>,
                },
                {
                  key: 'phone',
                  label: 'Điện thoại',
                  children: <a href={`tel:${r.guest.phone}`}>{r.guest.phone}</a>,
                },
                {
                  key: 'arrival',
                  label: 'Giờ đến dự kiến',
                  span: { xs: 1, md: 2 },
                  children: r.guest.arrivalTime,
                },
                {
                  key: 'request',
                  label: 'Yêu cầu đặc biệt',
                  span: { xs: 1, md: 2 },
                  children: r.guest.specialRequest || '—',
                },
              ]}
            />
          </Card>

          <Card title="Thanh toán">
            <Descriptions
              size="small"
              column={{ xs: 1, md: 2 }}
              className="mb-4"
              items={[
                { key: 'method', label: 'Phương thức', children: PAYMENT_METHOD_LABELS[r.paymentMethod] },
                { key: 'status', label: 'Trạng thái', children: <PaymentTag status={r.paymentStatus} /> },
              ]}
            />
            <QuoteSummary quote={r.quote} />
          </Card>

          <InternalNote key={r.updatedAt} reservation={r} />
        </div>

        <div className="flex flex-col gap-4">
          <Card styles={{ body: { padding: 0 } }}>
            <img
              src={r.roomImage}
              alt={r.roomName}
              className="block h-44 w-full rounded-t-lg bg-forest object-cover"
            />
            <div className="p-4">
              <div className="font-semibold text-ink">{r.roomName}</div>
              <div className="text-xs text-muted">{r.ratePlanName}</div>
            </div>
          </Card>

          <Card title="Lịch sử thao tác">
            <Timeline
              items={[...r.history].reverse().map((event) => ({
                key: `${event.at}-${event.action}`,
                color: TIMELINE_COLOR[event.action],
                content: (
                  <div>
                    <div className="font-medium text-ink">{ACTION_LABELS[event.action]}</div>
                    <div className="text-xs text-muted">
                      {event.actor} · {formatDateTime(event.at)}
                    </div>
                    {event.note && <div className="mt-1 text-sm text-body">{event.note}</div>}
                  </div>
                ),
              }))}
            />
          </Card>
        </div>
      </div>

      <EditGuestModal reservation={r} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  )
}

export default function ReservationDetailPage() {
  const { code = '' } = useParams()
  const query = useReservation(code)
  useDocumentTitle(code)

  if (query.isPending) {
    return (
      <>
        <PageHeader title={code} backTo="/dat-phong" />
        <Skeleton active paragraph={{ rows: 10 }} />
      </>
    )
  }

  if (query.isError) {
    if (query.error instanceof ApiError && query.error.status === 404) {
      return (
        <Result
          status="404"
          title="Không tìm thấy đặt phòng"
          subTitle={`Mã ${code} không tồn tại.`}
          extra={
            <Link to="/dat-phong">
              <Button type="primary">Về danh sách đặt phòng</Button>
            </Link>
          }
        />
      )
    }
    return (
      <>
        <PageHeader title={code} backTo="/dat-phong" />
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      </>
    )
  }

  return <Detail reservation={query.data} />
}
