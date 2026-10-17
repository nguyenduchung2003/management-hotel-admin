import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Modal, Skeleton } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router'
import { useCalendar } from '@/api/queries'
import { PageHeader } from '@/components/PageHeader'
import { QueryError } from '@/components/QueryError'
import { StatusTag } from '@/components/Tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { CalendarReservation } from '@/types/reservation'
import { cn } from '@/utils/cn'
import { DATE_FORMAT, formatDate, formatStayDate, todayISO } from '@/utils/stay'

const DAYS = 14
const NAME_COL = 200
const CELL_MIN = 72

interface Selection {
  roomName: string
  date: string
  reservations: CalendarReservation[]
}

function shift(date: string, days: number): string {
  return dayjs(date).add(days, 'day').format(DATE_FORMAT)
}

export default function CalendarPage() {
  useDocumentTitle('Lịch phòng')
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [selected, setSelected] = useState<Selection | null>(null)
  const query = useCalendar(from, DAYS)
  const data = query.data

  const gridStyle = {
    gridTemplateColumns: `${NAME_COL}px repeat(${DAYS}, minmax(${CELL_MIN}px, 1fr))`,
    minWidth: NAME_COL + DAYS * CELL_MIN,
  }

  const totals = data?.dates.map((_, index) => ({
    occupied: data.rooms.reduce((sum, room) => sum + room.cells[index].occupied, 0),
    total: data.rooms.reduce((sum, room) => sum + room.totalUnits, 0),
  }))

  return (
    <>
      <PageHeader
        title="Lịch phòng"
        subtitle={`${formatDate(from)} – ${formatDate(shift(from, DAYS - 1))}`}
        extra={
          <>
            <Button icon={<LeftOutlined />} onClick={() => setFrom(shift(from, -DAYS))} aria-label="14 ngày trước" />
            <Button onClick={() => setFrom(today)} disabled={from === today}>
              Hôm nay
            </Button>
            <Button icon={<RightOutlined />} onClick={() => setFrom(shift(from, DAYS))} aria-label="14 ngày sau" />
            <DatePicker
              allowClear={false}
              value={dayjs(from)}
              format="DD/MM/YYYY"
              onChange={(value) => value && setFrom(value.format(DATE_FORMAT))}
              aria-label="Chọn ngày bắt đầu"
            />
          </>
        }
      />

      {query.isError ? (
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      ) : !data ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Card styles={{ body: { padding: 0 } }}>
          <div className="overflow-x-auto">
            <div className={cn('grid text-sm transition-opacity', query.isFetching && 'opacity-60')} style={gridStyle}>
              <div className="sticky left-0 z-10 border-b border-line bg-[#FAFAF7] px-4 py-3 font-semibold text-ink">
                Hạng phòng
              </div>
              {data.dates.map((date) => {
                const isToday = date === today
                const weekday = dayjs(date).day()
                return (
                  <div
                    key={date}
                    className={cn(
                      'border-b border-l border-line px-1 py-2 text-center',
                      isToday ? 'bg-gold text-white' : 'bg-[#FAFAF7]',
                      !isToday && (weekday === 0 || weekday === 6) && 'text-[#C0392B]',
                    )}
                  >
                    <div className="text-xs font-semibold">{dayjs(date).format('dd')}</div>
                    <div className="lining-nums">{dayjs(date).format('DD/MM')}</div>
                  </div>
                )
              })}

              {data.rooms.map((room) => (
                <div key={room.roomId} className="contents">
                  <div className="sticky left-0 z-10 flex flex-col justify-center border-b border-line bg-white px-4 py-3">
                    <span className="font-medium text-ink">{room.roomName}</span>
                    <span className="text-xs text-muted">{room.totalUnits} phòng</span>
                  </div>
                  {room.cells.map((cell) => {
                    const full = cell.occupied >= room.totalUnits
                    const empty = cell.occupied === 0
                    return (
                      <button
                        key={cell.date}
                        type="button"
                        disabled={empty}
                        aria-label={`${room.roomName}, ${formatStayDate(cell.date)}: ${cell.occupied}/${room.totalUnits} phòng`}
                        onClick={() =>
                          setSelected({ roomName: room.roomName, date: cell.date, reservations: cell.reservations })
                        }
                        className={cn(
                          'border-0 border-b border-l border-line py-3 text-center font-semibold lining-nums transition-colors',
                          empty && 'cursor-default bg-white font-normal text-[#B8BDC2]',
                          !empty && !full && 'cursor-pointer bg-[#FBF1DC] text-gold-dark hover:bg-[#F6E4BC]',
                          full && 'cursor-pointer bg-[#F8D9D4] text-[#8F2A1F] hover:bg-[#F2C4BD]',
                          cell.date === today && empty && 'bg-[#FFFBF2]',
                        )}
                      >
                        {empty ? '—' : `${cell.occupied}/${room.totalUnits}`}
                      </button>
                    )
                  })}
                </div>
              ))}

              <div className="sticky left-0 z-10 bg-[#FAFAF7] px-4 py-3 font-semibold text-ink">Tỷ lệ lấp đầy</div>
              {totals?.map((item, index) => (
                <div
                  key={data.dates[index]}
                  className="border-l border-line bg-[#FAFAF7] py-3 text-center font-semibold text-ink lining-nums"
                >
                  {Math.round((item.occupied / item.total) * 100)}%
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-xs text-muted">
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-white ring-1 ring-line" /> Còn trống
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-[#FBF1DC] ring-1 ring-line" /> Còn một phần
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-[#F8D9D4] ring-1 ring-line" /> Hết phòng
        </li>
        <li>Chỉ tính đặt phòng đang giữ phòng (chờ thanh toán, đã xác nhận, đang lưu trú, đã trả).</li>
      </ul>

      <Modal
        open={selected !== null}
        onCancel={() => setSelected(null)}
        footer={null}
        title={selected ? `${selected.roomName} · ${formatStayDate(selected.date)}` : ''}
        destroyOnHidden
      >
        <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
          {selected?.reservations.map((reservation) => (
            <li key={reservation.code} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link to={`/dat-phong/${reservation.code}`} onClick={() => setSelected(null)} className="font-medium">
                  {reservation.guestName}
                </Link>
                <div className="text-xs text-muted lining-nums">
                  {reservation.code} · {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)}
                </div>
              </div>
              <StatusTag status={reservation.status} />
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
