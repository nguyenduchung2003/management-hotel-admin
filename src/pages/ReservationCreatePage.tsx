import { Alert, Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Skeleton, Tag } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useNavigate } from 'react-router'
import { useCreateReservation } from '@/api/mutations'
import { useAddons, useQuote, useRatePlans, useRooms } from '@/api/queries'
import { GuestFields } from '@/components/GuestFields'
import { PageHeader } from '@/components/PageHeader'
import { QueryError } from '@/components/QueryError'
import { QuoteSummary } from '@/components/QuoteSummary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { RatePlan, Room } from '@/types/homestay'
import type {
  Addon,
  GuestDetails,
  PaymentMethod,
  QuoteRequest,
  ReservationSource,
} from '@/types/reservation'
import { formatVND } from '@/utils/money'
import { PAYMENT_METHOD_LABELS, SOURCE_LABELS, toOptions } from '@/utils/reservationLabels'
import { DATE_FORMAT } from '@/utils/stay'

interface FormValues {
  guest: GuestDetails
  dates: [Dayjs, Dayjs]
  adults: number
  children: number
  roomId: string
  ratePlanId: string
  addonIds: string[]
  promoCode?: string
  paymentMethod: PaymentMethod
  paymentStatus: 'unpaid' | 'paid'
  source: ReservationSource
  internalNote?: string
}

const SOURCES: ReservationSource[] = ['phone', 'walk_in', 'ota']

function toQuoteRequest(values?: Partial<FormValues>): QuoteRequest | null {
  const checkIn = values?.dates?.[0]
  const checkOut = values?.dates?.[1]
  if (!values?.roomId || !values.ratePlanId || !checkIn || !checkOut || !values.adults) return null
  if (!checkOut.isAfter(checkIn, 'day')) return null

  const promo = values.promoCode?.trim().toUpperCase()
  return {
    roomId: values.roomId,
    ratePlanId: values.ratePlanId,
    checkIn: checkIn.format(DATE_FORMAT),
    checkOut: checkOut.format(DATE_FORMAT),
    adults: values.adults,
    children: values.children ?? 0,
    addonIds: values.addonIds ?? [],
    ...(promo ? { promoCode: promo } : {}),
  }
}

function CreateForm({ rooms, ratePlans, addons }: { rooms: Room[]; ratePlans: RatePlan[]; addons: Addon[] }) {
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()
  const values = Form.useWatch([], form) as Partial<FormValues> | undefined
  const create = useCreateReservation()

  const request = toQuoteRequest(values)
  const quote = useQuote(request)
  const room = rooms.find((item) => item.id === values?.roomId)
  const ratePlan = ratePlans.find((item) => item.id === values?.ratePlanId)
  const result = quote.data
  const promoEntered = Boolean(values?.promoCode?.trim())
  const promoError = promoEntered ? result?.promotionError : null

  const blocker = !request
    ? 'Chọn hạng phòng, ngày và số khách để xem báo giá.'
    : !result
      ? null
      : result.availableUnits < 1
        ? 'Hạng phòng đã hết trong thời gian này.'
        : !result.fitsGuests
          ? 'Số khách vượt quá sức chứa của hạng phòng.'
          : promoError
            ? promoError
            : null

  function submit(formValues: FormValues) {
    const body = toQuoteRequest(formValues)
    if (!body) return
    create.mutate(
      {
        ...body,
        guest: {
          ...formValues.guest,
          fullName: formValues.guest.fullName.trim(),
          phone: formValues.guest.phone.trim(),
          email: formValues.guest.email.trim(),
        },
        paymentMethod: formValues.paymentMethod,
        paymentStatus: formValues.paymentStatus,
        source: formValues.source,
        internalNote: formValues.internalNote?.trim() || undefined,
      },
      { onSuccess: (reservation) => navigate(`/dat-phong/${reservation.code}`) },
    )
  }

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      disabled={create.isPending}
      initialValues={{
        guest: { title: 'mr', country: 'Việt Nam', arrivalTime: 'Chưa xác định' },
        dates: [dayjs(), dayjs().add(1, 'day')],
        adults: 2,
        children: 0,
        ratePlanId: ratePlans[0]?.id,
        addonIds: [],
        paymentMethod: 'pay_at_property',
        paymentStatus: 'unpaid',
        source: 'phone',
      }}
      onFinish={submit}
      onFinishFailed={() => undefined}
      className="grid gap-4 xl:grid-cols-[1fr_380px]"
    >
      <div className="flex flex-col gap-4">
        <Card title="1. Thông tin khách">
          <GuestFields />
        </Card>

        <Card title="2. Lưu trú & phòng">
          <Form.Item
            name="dates"
            label="Nhận phòng — Trả phòng"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày lưu trú' },
              {
                validator: (_, value: [Dayjs, Dayjs] | undefined) =>
                  value && value[1].isAfter(value[0], 'day')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Ngày trả phòng phải sau ngày nhận phòng')),
              },
            ]}
          >
            <DatePicker.RangePicker
              format="DD/MM/YYYY"
              allowClear={false}
              disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
              className="w-full md:w-96"
            />
          </Form.Item>

          <div className="grid gap-x-4 md:grid-cols-2">
            <Form.Item name="adults" label="Người lớn" rules={[{ required: true, message: 'Nhập số người lớn' }]}>
              <InputNumber min={1} max={room?.maxAdults ?? 8} className="w-full" />
            </Form.Item>
            <Form.Item name="children" label="Trẻ em">
              <InputNumber min={0} max={room?.maxChildren ?? 6} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="roomId" label="Hạng phòng" rules={[{ required: true, message: 'Vui lòng chọn hạng phòng' }]}>
            <Select
              placeholder="Chọn hạng phòng"
              options={rooms.map((item) => ({
                value: item.id,
                label: `${item.name} · tối đa ${item.maxAdults} NL + ${item.maxChildren} TE · ${formatVND(item.basePrice)}/đêm`,
              }))}
            />
          </Form.Item>

          <Form.Item name="ratePlanId" label="Gói giá" rules={[{ required: true, message: 'Vui lòng chọn gói giá' }]}>
            <Radio.Group className="flex flex-col gap-2">
              {ratePlans.map((plan) => (
                <Radio key={plan.id} value={plan.id}>
                  {plan.name} <span className="text-muted">— {plan.description}</span>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item name="addonIds" label="Dịch vụ thêm">
            <Checkbox.Group
              className="flex flex-col gap-2"
              options={addons.map((addon) => ({
                value: addon.id,
                label: `${addon.name} — ${formatVND(addon.price)}${addon.unit === 'per_night' ? ' / đêm' : ''}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="promoCode"
            label="Mã ưu đãi"
            normalize={(value: string | undefined) => value?.toUpperCase()}
            validateStatus={promoError ? 'error' : undefined}
            help={promoError ?? undefined}
            className="mb-0! md:max-w-xs"
          >
            <Input placeholder="Ví dụ: DATSOM" maxLength={20} allowClear />
          </Form.Item>
        </Card>

        <Card title="3. Thanh toán & nguồn đặt">
          <div className="grid gap-x-4 md:grid-cols-2">
            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              dependencies={['ratePlanId']}
              rules={[
                {
                  validator: (_, value: PaymentMethod) =>
                    value === 'pay_at_property' && ratePlan && !ratePlan.refundable
                      ? Promise.reject(new Error('Gói không hoàn huỷ không áp dụng thanh toán tại homestay'))
                      : Promise.resolve(),
                },
              ]}
            >
              <Select options={toOptions(PAYMENT_METHOD_LABELS)} />
            </Form.Item>
            <Form.Item name="paymentStatus" label="Trạng thái thanh toán">
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                options={[
                  { value: 'unpaid', label: 'Chưa thanh toán' },
                  { value: 'paid', label: 'Đã thanh toán' },
                ]}
              />
            </Form.Item>
            <Form.Item name="source" label="Nguồn đặt">
              <Select options={SOURCES.map((value) => ({ value, label: SOURCE_LABELS[value] }))} />
            </Form.Item>
          </div>
          <Form.Item name="internalNote" label="Ghi chú nội bộ" className="mb-0!">
            <Input.TextArea rows={2} maxLength={1000} showCount placeholder="Khách không nhìn thấy ghi chú này" />
          </Form.Item>
        </Card>
      </div>

      <div>
        <Card title="Báo giá" className="xl:sticky xl:top-20">
          {!request ? (
            <p className="m-0 text-sm text-muted">{blocker}</p>
          ) : quote.isError ? (
            <QueryError error={quote.error} onRetry={() => quote.refetch()} />
          ) : !result ? (
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          ) : (
            <div className={quote.isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted">Phòng trống</span>
                <Tag color={result.availableUnits === 0 ? 'red' : result.availableUnits <= 1 ? 'orange' : 'green'}>
                  {result.availableUnits}/{result.totalUnits} phòng
                </Tag>
              </div>
              {blocker && <Alert type="warning" showIcon title={blocker} className="mb-3" />}
              <QuoteSummary quote={result.quote} />
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="mt-5"
            loading={create.isPending}
            disabled={!request || !result || Boolean(blocker)}
          >
            Tạo đặt phòng
          </Button>
          <Button block className="mt-2" onClick={() => navigate('/dat-phong')} disabled={create.isPending}>
            Huỷ
          </Button>
        </Card>
      </div>
    </Form>
  )
}

export default function ReservationCreatePage() {
  useDocumentTitle('Tạo đặt phòng')
  const rooms = useRooms()
  const ratePlans = useRatePlans()
  const addons = useAddons()

  const error = rooms.error ?? ratePlans.error ?? addons.error

  return (
    <>
      <PageHeader
        title="Tạo đặt phòng"
        subtitle="Cho khách gọi điện, vãng lai hoặc đặt qua OTA"
        backTo="/dat-phong"
        backLabel="Về danh sách đặt phòng"
      />
      {error ? (
        <QueryError error={error} onRetry={() => void Promise.all([rooms.refetch(), ratePlans.refetch(), addons.refetch()])} />
      ) : rooms.data && ratePlans.data && addons.data ? (
        <CreateForm rooms={rooms.data} ratePlans={ratePlans.data} addons={addons.data} />
      ) : (
        <Skeleton active paragraph={{ rows: 12 }} />
      )}
    </>
  )
}
