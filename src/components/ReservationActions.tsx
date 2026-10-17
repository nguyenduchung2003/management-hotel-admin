import { Alert, App, Button, Checkbox, Form, Input, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useReservationActions } from '@/api/mutations'
import type { Reservation } from '@/types/reservation'
import { formatVND } from '@/utils/money'
import { actionError, isActionVisible, isFreeCancel, type AdminAction } from '@/utils/reservationRules'
import { formatDate } from '@/utils/stay'

interface CancelValues {
  reason: string
  refund: boolean
}

function CancelModal({
  reservation,
  open,
  onClose,
}: {
  reservation: Reservation
  open: boolean
  onClose: () => void
}) {
  const actions = useReservationActions()
  const [form] = Form.useForm<CancelValues>()
  const paid = reservation.paymentStatus === 'paid'
  const freeWindow = isFreeCancel(reservation)

  async function submit(values: CancelValues) {
    try {
      await actions.cancel.mutateAsync({
        code: reservation.code,
        reason: values.reason.trim(),
        refund: paid && values.refund,
      })
      onClose()
    } catch {
      // Lỗi đã hiện bằng thông báo ở onError của mutation; giữ hộp thoại để nhân viên thử lại.
    }
  }

  return (
    <Modal
      open={open}
      title={`Huỷ đặt phòng ${reservation.code}`}
      okText="Huỷ đặt phòng"
      okButtonProps={{ danger: true }}
      cancelText="Đóng"
      confirmLoading={actions.cancel.isPending}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Alert
        type={freeWindow ? 'success' : 'warning'}
        showIcon
        className="mb-4"
        title={
          reservation.freeCancelUntil
            ? freeWindow
              ? `Còn trong hạn huỷ miễn phí đến hết ${formatDate(reservation.freeCancelUntil)}.`
              : `Đã quá hạn huỷ miễn phí (${formatDate(reservation.freeCancelUntil)}). Quản lý quyết định có hoàn tiền hay không.`
            : 'Gói không hoàn huỷ. Chỉ hoàn tiền khi quản lý đồng ý.'
        }
      />
      <Form<CancelValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ reason: '', refund: paid && freeWindow }}
        onFinish={submit}
      >
        <Form.Item
          name="reason"
          label="Lý do huỷ"
          rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập lý do huỷ' }]}
        >
          <Input.TextArea rows={3} maxLength={300} showCount placeholder="Ví dụ: Khách đổi kế hoạch" autoFocus />
        </Form.Item>
        {paid ? (
          <Form.Item name="refund" valuePropName="checked" className="mb-0!">
            <Checkbox>Hoàn lại {formatVND(reservation.quote.total)} cho khách</Checkbox>
          </Form.Item>
        ) : (
          <p className="m-0 text-xs text-muted">Đặt phòng chưa thanh toán nên không có khoản hoàn tiền.</p>
        )}
      </Form>
    </Modal>
  )
}

const CONFIRM_TEXT: Record<Exclude<AdminAction, 'cancel'>, { title: string; content?: string; ok: string }> = {
  confirm_payment: { title: 'Xác nhận đã thanh toán?', ok: 'Xác nhận thanh toán' },
  check_in: { title: 'Nhận phòng cho khách?', ok: 'Nhận phòng' },
  check_out: { title: 'Trả phòng?', content: 'Phòng sẽ được giải phóng.', ok: 'Trả phòng' },
  no_show: {
    title: 'Đánh dấu khách không đến?',
    content: 'Phòng sẽ được giải phóng cho khách khác.',
    ok: 'Không đến',
  },
}

export function ReservationActions({ reservation }: { reservation: Reservation }) {
  const actions = useReservationActions()
  const { modal } = App.useApp()
  const [cancelOpen, setCancelOpen] = useState(false)
  const { code } = reservation

  const runners: Record<Exclude<AdminAction, 'cancel'>, () => Promise<unknown>> = {
    confirm_payment: () => actions.confirmPayment.mutateAsync(code),
    check_in: () => actions.checkIn.mutateAsync(code),
    check_out: () => actions.checkOut.mutateAsync(code),
    no_show: () => actions.noShow.mutateAsync(code),
  }

  function ask(action: Exclude<AdminAction, 'cancel'>) {
    const text = CONFIRM_TEXT[action]
    modal.confirm({
      title: text.title,
      content:
        action === 'confirm_payment'
          ? `Xác nhận đã nhận ${formatVND(reservation.quote.total)} từ khách ${reservation.guest.fullName}.`
          : text.content,
      okText: text.ok,
      cancelText: 'Đóng',
      onOk: async () => {
        try {
          await runners[action]()
        } catch {
          // đã có thông báo lỗi ở onError của mutation
        }
      },
    })
  }

  function button(
    action: Exclude<AdminAction, 'cancel'>,
    label: string,
    options: { primary?: boolean; loading: boolean },
  ) {
    if (!isActionVisible(action, reservation)) return null
    const error = actionError(action, reservation)
    return (
      <Tooltip title={error}>
        <span>
          <Button
            type={options.primary ? 'primary' : 'default'}
            disabled={Boolean(error)}
            loading={options.loading}
            onClick={() => ask(action)}
          >
            {label}
          </Button>
        </span>
      </Tooltip>
    )
  }

  return (
    <>
      {button('confirm_payment', 'Xác nhận thanh toán', {
        primary: reservation.status === 'pending_payment',
        loading: actions.confirmPayment.isPending,
      })}
      {button('check_in', 'Nhận phòng', { primary: true, loading: actions.checkIn.isPending })}
      {button('check_out', 'Trả phòng', { primary: true, loading: actions.checkOut.isPending })}
      {button('no_show', 'Không đến', { loading: actions.noShow.isPending })}
      {isActionVisible('cancel', reservation) && (
        <Button danger onClick={() => setCancelOpen(true)}>
          Huỷ đặt phòng
        </Button>
      )}
      <CancelModal reservation={reservation} open={cancelOpen} onClose={() => setCancelOpen(false)} />
    </>
  )
}
