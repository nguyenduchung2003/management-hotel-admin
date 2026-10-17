import { Form, Input, Select } from 'antd'
import { ARRIVAL_TIMES, COUNTRIES } from '@/utils/reservationLabels'

const PHONE_PATTERN = /^\+?[\d\s.]{9,16}$/

/** Nhóm ô nhập thông tin khách, dùng chung cho form tạo đặt phòng và hộp thoại sửa. Tên trường: guest.* */
export function GuestFields() {
  return (
    <>
      <div className="grid gap-x-4 md:grid-cols-[120px_1fr]">
        <Form.Item name={['guest', 'title']} label="Danh xưng">
          <Select options={[{ value: 'mr', label: 'Ông' }, { value: 'ms', label: 'Bà' }]} />
        </Form.Item>
        <Form.Item
          name={['guest', 'fullName']}
          label="Họ và tên"
          rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input autoComplete="off" maxLength={80} placeholder="Nguyễn Văn A" />
        </Form.Item>
      </div>
      <div className="grid gap-x-4 md:grid-cols-2">
        <Form.Item
          name={['guest', 'email']}
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email chưa đúng định dạng' },
          ]}
        >
          <Input autoComplete="off" inputMode="email" placeholder="email@domain.com" />
        </Form.Item>
        <Form.Item
          name={['guest', 'phone']}
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: PHONE_PATTERN, message: 'Số điện thoại chưa hợp lệ' },
          ]}
        >
          <Input autoComplete="off" inputMode="tel" placeholder="0912 345 678" />
        </Form.Item>
        <Form.Item name={['guest', 'country']} label="Quốc gia">
          <Select showSearch options={COUNTRIES.map((value) => ({ value, label: value }))} />
        </Form.Item>
        <Form.Item name={['guest', 'arrivalTime']} label="Giờ đến dự kiến">
          <Select options={ARRIVAL_TIMES.map((value) => ({ value, label: value }))} />
        </Form.Item>
      </div>
      <Form.Item name={['guest', 'specialRequest']} label="Yêu cầu đặc biệt của khách" className="mb-0!">
        <Input.TextArea rows={3} maxLength={500} showCount placeholder="Ví dụ: phòng tầng cao, giường phụ…" />
      </Form.Item>
    </>
  )
}
