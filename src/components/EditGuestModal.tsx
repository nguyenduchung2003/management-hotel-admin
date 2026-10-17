import { Form, Modal } from 'antd'
import { useReservationActions } from '@/api/mutations'
import { GuestFields } from '@/components/GuestFields'
import type { GuestDetails, Reservation } from '@/types/reservation'

export function EditGuestModal({
  reservation,
  open,
  onClose,
}: {
  reservation: Reservation
  open: boolean
  onClose: () => void
}) {
  const actions = useReservationActions()
  const [form] = Form.useForm<{ guest: GuestDetails }>()

  async function submit(values: { guest: GuestDetails }) {
    try {
      await actions.update.mutateAsync({
        code: reservation.code,
        input: { guest: { ...values.guest, fullName: values.guest.fullName.trim() } },
      })
      onClose()
    } catch {
      // thông báo lỗi đã hiện ở onError; giữ hộp thoại để sửa tiếp
    }
  }

  return (
    <Modal
      open={open}
      title="Sửa thông tin khách"
      okText="Lưu thay đổi"
      cancelText="Đóng"
      width={640}
      confirmLoading={actions.update.isPending}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ guest: reservation.guest }}
        onFinish={submit}
        className="pt-2"
      >
        <GuestFields />
      </Form>
    </Modal>
  )
}
