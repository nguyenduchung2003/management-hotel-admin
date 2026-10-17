import {
  DollarOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  RightOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Button, Card, Empty, Progress, Skeleton, Statistic, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useReservationActions } from '@/api/mutations'
import { useReservationList, useStats } from '@/api/queries'
import { useAppDispatch } from '@/app/hooks'
import { resetFilters, setFilters } from '@/app/slices/reservationFiltersSlice'
import { PageHeader } from '@/components/PageHeader'
import { QueryError } from '@/components/QueryError'
import { PaymentTag, StatusTag } from '@/components/Tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Reservation, ReservationStatus } from '@/types/reservation'
import { formatCompactVND, formatVND } from '@/utils/money'
import { actionError } from '@/utils/reservationRules'
import { NO_NESTED_ROWS, SOURCE_LABELS, STATUS_LABELS, STATUS_ORDER } from '@/utils/reservationLabels'
import { formatDateTime, formatStayDate, guestLabel, todayISO } from '@/utils/stay'

const BAR_COLOR: Record<ReservationStatus, string> = {
  pending_payment: '#D98A1F',
  confirmed: '#2F6F8F',
  checked_in: '#2E7D5B',
  checked_out: '#9AA0A6',
  cancelled: '#C0392B',
  no_show: '#E4572E',
}

function StatCard(props: {
  title: string
  value: number | string
  suffix?: string
  icon: ReactNode
  tone: string
  footer?: ReactNode
  loading: boolean
}) {
  return (
    <Card className="h-full" styles={{ body: { padding: 20 } }}>
      <div className="flex items-start justify-between gap-3">
        <Statistic title={props.title} value={props.value} suffix={props.suffix} loading={props.loading} />
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: `${props.tone}1F`, color: props.tone }}
        >
          {props.icon}
        </span>
      </div>
      <div className="mt-3 min-h-6">{props.footer}</div>
    </Card>
  )
}

type Kind = 'arrival' | 'departure'

function useQuickAction() {
  const actions = useReservationActions()

  return (reservation: Reservation, kind: Kind): ReactNode => {
    const { code } = reservation
    const busy = (mutation: { isPending: boolean; variables?: unknown }) =>
      mutation.isPending && mutation.variables === code

    if (reservation.status === 'pending_payment' || (kind === 'departure' && reservation.status === 'checked_in' && reservation.paymentStatus === 'unpaid')) {
      return (
        <Button size="small" loading={busy(actions.confirmPayment)} onClick={() => actions.confirmPayment.mutate(code)}>
          Xác nhận thanh toán
        </Button>
      )
    }
    if (reservation.status === 'confirmed') {
      const error = actionError('check_in', reservation)
      return (
        <Tooltip title={error}>
          <span>
            <Button
              type="primary"
              size="small"
              disabled={Boolean(error)}
              loading={busy(actions.checkIn)}
              onClick={() => actions.checkIn.mutate(code)}
            >
              Nhận phòng
            </Button>
          </span>
        </Tooltip>
      )
    }
    if (reservation.status === 'checked_in' && kind === 'departure') {
      return (
        <Button type="primary" size="small" loading={busy(actions.checkOut)} onClick={() => actions.checkOut.mutate(code)}>
          Trả phòng
        </Button>
      )
    }
    return <span className="text-xs text-muted">{STATUS_LABELS[reservation.status].label}</span>
  }
}

function TodayCard(props: { title: string; kind: Kind; statuses: ReservationStatus[]; date: string }) {
  const quickAction = useQuickAction()
  const query = useReservationList({
    page: 1,
    pageSize: 50,
    dateField: props.kind === 'arrival' ? 'checkIn' : 'checkOut',
    dateFrom: props.date,
    dateTo: props.date,
    sortField: 'checkIn',
    sortOrder: 'asc',
  })
  const rows = (query.data?.items ?? []).filter((r) => props.statuses.includes(r.status))

  const columns: ColumnsType<Reservation> = [
    {
      title: 'Khách',
      key: 'guest',
      render: (_, r) => (
        <div className="min-w-0">
          <Link to={`/dat-phong/${r.code}`} className="font-medium">
            {r.guest.fullName}
          </Link>
          <div className="text-xs text-muted">
            {r.code} · {guestLabel(r.adults, r.children)}
          </div>
        </div>
      ),
    },
    { title: 'Phòng', dataIndex: 'roomName', key: 'room', responsive: ['md'] },
    {
      title: 'Thanh toán',
      key: 'payment',
      responsive: ['lg'],
      render: (_, r) => <PaymentTag status={r.paymentStatus} />,
    },
    { title: '', key: 'action', align: 'right', render: (_, r) => quickAction(r, props.kind) },
  ]

  return (
    <Card
      className="min-w-0"
      title={
        <span className="flex items-center gap-2">
          {props.kind === 'arrival' ? <LoginOutlined /> : <LogoutOutlined />}
          {props.title}
          {query.data && <span className="text-sm font-normal text-muted">({rows.length})</span>}
        </span>
      }
      styles={{ body: { padding: 0 } }}
    >
      {query.isError ? (
        <div className="p-4">
          <QueryError error={query.error} onRetry={() => query.refetch()} />
        </div>
      ) : (
        <Table<Reservation>
          rowKey="code"
          childrenColumnName={NO_NESTED_ROWS}
          size="middle"
          columns={columns}
          dataSource={rows}
          loading={query.isPending}
          pagination={false}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có khách" /> }}
        />
      )}
    </Card>
  )
}

export default function DashboardPage() {
  useDocumentTitle('Tổng quan')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const stats = useStats()
  const recent = useReservationList({
    page: 1,
    pageSize: 6,
    dateField: 'checkIn',
    sortField: 'createdAt',
    sortOrder: 'desc',
  })
  const today = stats.data?.date ?? todayISO()
  const data = stats.data
  const occupancy = data && data.totalUnits > 0 ? Math.round((data.occupiedUnits / data.totalUnits) * 100) : 0

  function openList(filters: Parameters<typeof setFilters>[0]) {
    dispatch(resetFilters())
    dispatch(setFilters(filters))
    navigate('/dat-phong')
  }

  const link = (label: string, filters: Parameters<typeof setFilters>[0]) => (
    <Button type="link" size="small" className="p-0!" onClick={() => openList(filters)}>
      {label} <RightOutlined />
    </Button>
  )

  const recentColumns: ColumnsType<Reservation> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      render: (code: string) => <Link to={`/dat-phong/${code}`}>{code}</Link>,
    },
    {
      title: 'Khách',
      key: 'guest',
      render: (_, r) => (
        <div>
          <div className="font-medium">{r.guest.fullName}</div>
          <div className="text-xs text-muted">{r.roomName}</div>
        </div>
      ),
    },
    {
      title: 'Lưu trú',
      key: 'stay',
      responsive: ['md'],
      render: (_, r) => (
        <span className="text-xs">
          {formatStayDate(r.checkIn)} · {r.nights} đêm
        </span>
      ),
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      responsive: ['lg'],
      render: (source: Reservation['source']) => SOURCE_LABELS[source],
    },
    { title: 'Tổng tiền', key: 'total', align: 'right', render: (_, r) => formatVND(r.quote.total) },
    { title: 'Trạng thái', key: 'status', render: (_, r) => <StatusTag status={r.status} /> },
    {
      title: 'Tạo lúc',
      dataIndex: 'createdAt',
      responsive: ['xl'],
      render: (at: string) => <span className="text-xs text-muted">{formatDateTime(at)}</span>,
    },
  ]

  return (
    <>
      <PageHeader
        title="Tổng quan"
        subtitle={`Hôm nay, ${formatStayDate(today)}`}
        extra={
          <Button onClick={() => stats.refetch()} loading={stats.isFetching && !stats.isPending}>
            Làm mới
          </Button>
        }
      />

      {stats.isError && (
        <div className="mb-4">
          <QueryError error={stats.error} onRetry={() => stats.refetch()} />
        </div>
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Khách đến hôm nay"
          value={data?.arrivalsToday ?? 0}
          icon={<LoginOutlined />}
          tone="#2F6F8F"
          loading={stats.isPending}
          footer={link('Xem danh sách', { dateField: 'checkIn', dateFrom: today, dateTo: today })}
        />
        <StatCard
          title="Khách đi hôm nay"
          value={data?.departuresToday ?? 0}
          icon={<LogoutOutlined />}
          tone="#8E6BBF"
          loading={stats.isPending}
          footer={link('Xem danh sách', { dateField: 'checkOut', dateFrom: today, dateTo: today })}
        />
        <StatCard
          title="Đang lưu trú"
          value={data?.inHouse ?? 0}
          icon={<TeamOutlined />}
          tone="#2E7D5B"
          loading={stats.isPending}
          footer={link('Xem danh sách', { status: 'checked_in' })}
        />
        <StatCard
          title="Chờ thanh toán"
          value={data?.pendingPayment ?? 0}
          icon={<WalletOutlined />}
          tone="#D98A1F"
          loading={stats.isPending}
          footer={link('Xử lý ngay', { status: 'pending_payment' })}
        />
        <StatCard
          title="Lấp đầy tối nay"
          value={`${data?.occupiedUnits ?? 0}/${data?.totalUnits ?? 0}`}
          suffix="phòng"
          icon={<HomeOutlined />}
          tone="#BF882E"
          loading={stats.isPending}
          footer={<Progress percent={occupancy} size="small" strokeColor="#BF882E" />}
        />
        <StatCard
          title="Doanh thu tháng này"
          value={formatCompactVND(data?.revenueThisMonth ?? 0)}
          icon={<DollarOutlined />}
          tone="#0F332C"
          loading={stats.isPending}
          footer={<span className="text-xs text-muted">Đơn đã thanh toán, nhận phòng trong tháng</span>}
        />
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <TodayCard title="Khách đến hôm nay" kind="arrival" statuses={['pending_payment', 'confirmed', 'checked_in']} date={today} />
        <TodayCard title="Khách đi hôm nay" kind="departure" statuses={['checked_in', 'checked_out']} date={today} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card
          className="min-w-0"
          title="Đặt phòng mới nhất"
          extra={
            <Link to="/dat-phong" onClick={() => dispatch(resetFilters())}>
              Xem tất cả
            </Link>
          }
          styles={{ body: { padding: 0 } }}
        >
          {recent.isError ? (
            <div className="p-4">
              <QueryError error={recent.error} onRetry={() => recent.refetch()} />
            </div>
          ) : (
            <Table<Reservation>
              rowKey="code"
              childrenColumnName={NO_NESTED_ROWS}
              size="middle"
              columns={recentColumns}
              dataSource={recent.data?.items}
              loading={recent.isPending}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </Card>

        <Card className="min-w-0" title="Phân bố trạng thái">
          {data ? (
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {STATUS_ORDER.map((status) => {
                const count = data.statusCounts[status]
                const percent = data.statusCounts.all ? Math.round((count / data.statusCounts.all) * 100) : 0
                return (
                  <li key={status}>
                    <button
                      type="button"
                      onClick={() => openList({ status })}
                      className="mb-1 flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-sm"
                    >
                      <span>{STATUS_LABELS[status].label}</span>
                      <b className="text-ink">{count}</b>
                    </button>
                    <Progress percent={percent} showInfo={false} size="small" strokeColor={BAR_COLOR[status]} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          )}
        </Card>
      </div>
    </>
  )
}
