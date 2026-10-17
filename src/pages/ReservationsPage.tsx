import { ReloadOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Empty, Input, Select, Table, Tabs, Tag } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import type { ColumnsType, SorterResult } from 'antd/es/table/interface'
import dayjs, { type Dayjs } from 'dayjs'
import { Link, useNavigate } from 'react-router'
import { useReservationList, useRooms, useStats } from '@/api/queries'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  DEFAULT_QUERY,
  resetFilters,
  setFilters,
  setPage,
  setSort,
} from '@/app/slices/reservationFiltersSlice'
import { PageHeader } from '@/components/PageHeader'
import { QueryError } from '@/components/QueryError'
import { PaymentTag, StatusTag } from '@/components/Tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type {
  PaymentStatus,
  Reservation,
  ReservationDateField,
  ReservationSortField,
  ReservationSource,
  ReservationStatus,
} from '@/types/reservation'
import { formatVND } from '@/utils/money'
import {
  NO_NESTED_ROWS,
  PAYMENT_STATUS_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
  toOptions,
} from '@/utils/reservationLabels'
import { DATE_FORMAT, formatDate, formatDateTime, guestLabel } from '@/utils/stay'

const DATE_FIELD_OPTIONS: { value: ReservationDateField; label: string }[] = [
  { value: 'checkIn', label: 'Ngày nhận phòng' },
  { value: 'checkOut', label: 'Ngày trả phòng' },
  { value: 'createdAt', label: 'Ngày tạo' },
]

const SORT_KEYS: ReservationSortField[] = ['checkIn', 'createdAt', 'total']

export default function ReservationsPage() {
  useDocumentTitle('Đặt phòng')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const query = useAppSelector((state) => state.reservationFilters.query)
  const list = useReservationList(query)
  const stats = useStats()
  const rooms = useRooms()

  const counts = stats.data?.statusCounts
  const tabItems = [
    { key: 'all', label: `Tất cả${counts ? ` (${counts.all})` : ''}` },
    ...STATUS_ORDER.map((status) => ({
      key: status,
      label: `${STATUS_LABELS[status].label}${counts ? ` (${counts[status]})` : ''}`,
    })),
  ]

  const hasFilter = Boolean(
    query.keyword ||
      query.status ||
      query.paymentStatus ||
      query.roomId ||
      query.source ||
      query.dateFrom ||
      query.dateTo,
  )

  const range: [Dayjs, Dayjs] | null =
    query.dateFrom && query.dateTo ? [dayjs(query.dateFrom), dayjs(query.dateTo)] : null

  const columns: ColumnsType<Reservation> = [
    {
      title: 'Mã đặt phòng',
      dataIndex: 'code',
      key: 'code',
      width: 170,
      render: (code: string) => (
        <Link
          to={`/dat-phong/${code}`}
          onClick={(event) => event.stopPropagation()}
          className="font-medium whitespace-nowrap"
        >
          {code}
        </Link>
      ),
    },
    {
      title: 'Khách',
      key: 'guest',
      width: 230,
      render: (_, r) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-ink">{r.guest.fullName}</div>
          <div className="truncate text-xs text-muted">
            {r.guest.phone} · {r.guest.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Hạng phòng',
      key: 'room',
      width: 190,
      render: (_, r) => (
        <div>
          <div>{r.roomName}</div>
          <div className="text-xs text-muted">{r.ratePlanName}</div>
        </div>
      ),
    },
    {
      title: 'Lưu trú',
      key: 'checkIn',
      width: 250,
      sorter: true,
      sortOrder: query.sortField === 'checkIn' ? (query.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_, r) => (
        <div className="lining-nums">
          <div className="whitespace-nowrap">
            {formatDate(r.checkIn)} → {formatDate(r.checkOut)}
          </div>
          <div className="text-xs text-muted">
            {r.nights} đêm · {guestLabel(r.adults, r.children)}
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      align: 'right',
      width: 130,
      sorter: true,
      sortOrder: query.sortField === 'total' ? (query.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_, r) => <b className="text-ink">{formatVND(r.quote.total)}</b>,
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 140,
      render: (_, r) => <PaymentTag status={r.paymentStatus} />,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, r) => <StatusTag status={r.status} />,
    },
    {
      title: 'Nguồn',
      key: 'source',
      width: 110,
      render: (_, r) => <Tag>{SOURCE_LABELS[r.source]}</Tag>,
    },
    {
      title: 'Tạo lúc',
      key: 'createdAt',
      width: 150,
      sorter: true,
      sortOrder: query.sortField === 'createdAt' ? (query.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_, r) => <span className="text-xs text-muted lining-nums">{formatDateTime(r.createdAt)}</span>,
    },
  ]

  function handleTableChange(
    pagination: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterResult<Reservation> | SorterResult<Reservation>[],
  ) {
    const current = Array.isArray(sorter) ? sorter[0] : sorter
    const key = current?.columnKey as ReservationSortField | undefined

    if (key && SORT_KEYS.includes(key) && current.order) {
      if (key !== query.sortField || (current.order === 'ascend') !== (query.sortOrder === 'asc')) {
        dispatch(setSort({ field: key, order: current.order === 'ascend' ? 'asc' : 'desc' }))
        return
      }
    } else if (!current?.order && query.sortField !== DEFAULT_QUERY.sortField) {
      // Bỏ sắp xếp → về mặc định
      dispatch(setSort({ field: DEFAULT_QUERY.sortField!, order: DEFAULT_QUERY.sortOrder! }))
      return
    }

    dispatch(
      setPage({ page: pagination.current ?? 1, pageSize: pagination.pageSize ?? DEFAULT_QUERY.pageSize }),
    )
  }

  return (
    <>
      <PageHeader
        title="Đặt phòng"
        subtitle="Tìm, lọc và xử lý tất cả đặt phòng"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => list.refetch()}
            loading={list.isFetching && !list.isPending}
          >
            Làm mới
          </Button>
        }
      />

      <Card styles={{ body: { padding: 0 } }}>
        <div className="border-b border-line px-4 pt-1 md:px-5">
          <Tabs
            activeKey={query.status ?? 'all'}
            items={tabItems}
            onChange={(key) =>
              dispatch(setFilters({ status: key === 'all' ? undefined : (key as ReservationStatus) }))
            }
            className="[&_.ant-tabs-nav]:mb-0!"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4 md:px-5">
          {/* key: ô tìm kiếm khởi tạo lại khi bộ lọc bị đặt lại / tìm nhanh từ thanh trên cùng */}
          <Input.Search
            key={query.keyword ?? ''}
            allowClear
            defaultValue={query.keyword}
            placeholder="Mã, tên khách, email, số điện thoại…"
            onSearch={(value) => dispatch(setFilters({ keyword: value.trim() || undefined }))}
            className="w-full sm:w-72"
          />
          <Select<PaymentStatus>
            allowClear
            placeholder="Thanh toán"
            value={query.paymentStatus}
            onChange={(value) => dispatch(setFilters({ paymentStatus: value }))}
            options={(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map((value) => ({
              value,
              label: PAYMENT_STATUS_LABELS[value].label,
            }))}
            className="w-full sm:w-40"
          />
          <Select<string>
            allowClear
            placeholder="Hạng phòng"
            value={query.roomId}
            onChange={(value) => dispatch(setFilters({ roomId: value }))}
            loading={rooms.isPending}
            options={rooms.data?.map((room) => ({ value: room.id, label: room.name }))}
            className="w-full sm:w-48"
          />
          <Select<ReservationSource>
            allowClear
            placeholder="Nguồn đặt"
            value={query.source}
            onChange={(value) => dispatch(setFilters({ source: value }))}
            options={toOptions(SOURCE_LABELS)}
            className="w-full sm:w-36"
          />
          <Select<ReservationDateField>
            value={query.dateField ?? 'checkIn'}
            onChange={(value) => dispatch(setFilters({ dateField: value }))}
            options={DATE_FIELD_OPTIONS}
            className="w-full sm:w-44"
          />
          <DatePicker.RangePicker
            value={range}
            format="DD/MM/YYYY"
            allowClear
            presets={[
              { label: 'Hôm nay', value: [dayjs(), dayjs()] },
              { label: 'Ngày mai', value: [dayjs().add(1, 'day'), dayjs().add(1, 'day')] },
              { label: '7 ngày tới', value: [dayjs(), dayjs().add(6, 'day')] },
              { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
            ]}
            onChange={(values) =>
              dispatch(
                setFilters({
                  dateFrom: values?.[0]?.format(DATE_FORMAT),
                  dateTo: values?.[1]?.format(DATE_FORMAT),
                }),
              )
            }
            className="w-full sm:w-auto"
          />
          {hasFilter && (
            <Button type="link" onClick={() => dispatch(resetFilters())}>
              Xoá bộ lọc
            </Button>
          )}
        </div>

        {list.isError ? (
          <div className="p-4">
            <QueryError error={list.error} onRetry={() => list.refetch()} />
          </div>
        ) : (
          <Table<Reservation>
            rowKey="code"
            childrenColumnName={NO_NESTED_ROWS}
            columns={columns}
            dataSource={list.data?.items}
            loading={list.isFetching}
            scroll={{ x: 1400 }}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => navigate(`/dat-phong/${record.code}`),
              className: 'cursor-pointer',
            })}
            pagination={{
              current: query.page,
              pageSize: query.pageSize,
              total: list.data?.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, [from, to]) => `${from}–${to} / ${total} đặt phòng`,
              className: 'px-4!',
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={hasFilter ? 'Không có đặt phòng nào khớp bộ lọc' : 'Chưa có đặt phòng'}
                >
                  {hasFilter && <Button onClick={() => dispatch(resetFilters())}>Xoá bộ lọc</Button>}
                </Empty>
              ),
            }}
          />
        )}
      </Card>
    </>
  )
}
