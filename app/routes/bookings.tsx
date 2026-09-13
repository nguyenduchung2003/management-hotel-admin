import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Drawer,
  Form,
  DatePicker,
  InputNumber,
  message,
  Typography,
  Tabs,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  INITIAL_BOOKINGS,
  INITIAL_PROPERTIES,
  type Booking,
  type BookingStatus,
} from '../mock/hotelAdminData';

const { Title, Text } = Typography;
const { Option } = Select;

export default function BookingManagementView() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // Modal / Drawer state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [form] = Form.useForm();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const updateBookingStatus = (code: string, newStatus: BookingStatus) => {
    const updated = bookings.map((b) => (b.code === code ? { ...b, status: newStatus } : b));
    setBookings(updated);

    const statusMap: Record<BookingStatus, string> = {
      confirmed: 'đã được xác nhận',
      completed: 'đã hoàn thành',
      cancelled: 'đã hủy',
      pending: 'chờ xử lý',
    };
    message.success(`Đơn đặt phòng ${code} ${statusMap[newStatus]}!`);

    if (selectedBooking && selectedBooking.code === code) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleCreateWalkInBooking = (values: any) => {
    const property = INITIAL_PROPERTIES.find((p) => p.id === values.propertyId);
    const roomType = property?.roomTypes.find((r) => r.id === values.roomTypeId);

    const checkInStr = values.checkIn ? values.checkIn.format('YYYY-MM-DD') : '2026-09-15';
    const checkOutStr = values.checkOut ? values.checkOut.format('YYYY-MM-DD') : '2026-09-17';
    const nights = values.nights || 2;
    const pricePerNight = roomType ? roomType.pricePerNight : 1500000;
    const totalPrice = pricePerNight * nights;

    const newBooking: Booking = {
      code: `BK-202609-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: `usr-walkin-${Date.now()}`,
      propertyId: values.propertyId,
      propertyName: property ? property.name : 'Cơ sở lưu trú',
      propertySlug: property ? property.slug : 'co-so-luu-tru',
      propertyImage: property ? property.images[0] : '',
      roomTypeId: values.roomTypeId,
      roomTypeName: roomType ? roomType.name : 'Loại phòng',
      checkIn: checkInStr,
      checkOut: checkOutStr,
      nights,
      guests: values.guests || 2,
      pricePerNight,
      totalPrice,
      status: 'confirmed',
      guestInfo: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || '',
        note: values.note || 'Khách vãng lai đặt trực tiếp tại lễ tân.',
      },
      createdAt: '2026-09-12 22:45',
    };

    setBookings([newBooking, ...bookings]);
    message.success(`Tạo đơn đặt phòng thành công! Mã đơn: ${newBooking.code}`);
    setIsWalkInModalOpen(false);
    form.resetFields();
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'all' || b.status === activeTab;
    const matchesSearch =
      b.code.toLowerCase().includes(searchText.toLowerCase()) ||
      b.guestInfo.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      b.guestInfo.phone.includes(searchText) ||
      b.propertyName.toLowerCase().includes(searchText.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusTag = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <Tag color="blue" icon={<CheckCircleOutlined />}>Đã xác nhận</Tag>;
      case 'pending':
        return <Tag color="warning" icon={<ClockCircleOutlined />}>Chờ xác nhận</Tag>;
      case 'completed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
      case 'cancelled':
        return <Tag color="error" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <span className="font-mono font-bold text-blue-600">{code}</span>,
    },
    {
      title: 'Khách hàng',
      key: 'guest',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {record.guestInfo.fullName}
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <PhoneOutlined /> {record.guestInfo.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Cơ sở & Loại phòng',
      key: 'property',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-semibold text-sm">{record.propertyName}</div>
          <div className="text-xs text-blue-600 font-medium">{record.roomTypeName}</div>
        </div>
      ),
    },
    {
      title: 'Lịch trình',
      key: 'dates',
      render: (_: any, record: Booking) => (
        <div className="text-xs">
          <div className="font-mono font-medium">
            {record.checkIn} ➔ {record.checkOut}
          </div>
          <div className="text-gray-400">
            {record.nights} đêm • {record.guests} khách
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (val: number) => <span className="font-bold text-emerald-600 text-sm">{formatCurrency(val)}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingStatus) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Booking) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-600" />}
            onClick={() => setSelectedBooking(record)}
          />

          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              className="bg-blue-600 text-xs"
              onClick={() => updateBookingStatus(record.code, 'confirmed')}
            >
              Xác nhận
            </Button>
          )}

          {record.status === 'confirmed' && (
            <Button
              type="primary"
              size="small"
              className="bg-emerald-600 text-xs border-none"
              onClick={() => updateBookingStatus(record.code, 'completed')}
            >
              Hoàn thành
            </Button>
          )}

          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Popconfirm
              title="Hủy đơn đặt phòng"
              description={`Bạn có chắc muốn hủy đơn ${record.code}?`}
              onConfirm={() => updateBookingStatus(record.code, 'cancelled')}
              okText="Hủy đơn"
              cancelText="Quay lại"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger size="small">
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            📅 Quản Lý Đặt Phòng
          </Title>
          <Text type="secondary" className="text-xs">
            Theo dõi, xử lý quy trình đặt phòng, check-in, hoàn tất và hủy đơn của khách hàng.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            form.resetFields();
            setIsWalkInModalOpen(true);
          }}
        >
          + Tạo đơn mới (Walk-in)
        </Button>
      </div>

      {/* Tabs & Search Card */}
      <Card className="border-none shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="w-full md:w-auto"
            items={[
              { key: 'all', label: `Tất cả (${bookings.length})` },
              {
                key: 'pending',
                label: `Chờ xác nhận (${bookings.filter((b) => b.status === 'pending').length})`,
              },
              {
                key: 'confirmed',
                label: `Đã xác nhận (${bookings.filter((b) => b.status === 'confirmed').length})`,
              },
              {
                key: 'completed',
                label: `Hoàn thành (${bookings.filter((b) => b.status === 'completed').length})`,
              },
              {
                key: 'cancelled',
                label: `Đã hủy (${bookings.filter((b) => b.status === 'cancelled').length})`,
              },
            ]}
          />
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-72"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="code"
          pagination={{ pageSize: 7 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={`Chi tiết đơn đặt phòng: ${selectedBooking?.code}`}
        width={550}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div>
                <Text type="secondary" className="text-xs">Trạng thái hiện tại</Text>
                <div className="mt-1">{getStatusTag(selectedBooking.status)}</div>
              </div>
              <div className="text-right">
                <Text type="secondary" className="text-xs">Tổng chi phí</Text>
                <div className="text-lg font-bold text-emerald-600">
                  {formatCurrency(selectedBooking.totalPrice)}
                </div>
              </div>
            </div>

            <Descriptions title="👤 Thông Tin Khách Hàng" column={1} bordered size="small">
              <Descriptions.Item label="Họ & Tên">{selectedBooking.guestInfo.fullName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedBooking.guestInfo.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedBooking.guestInfo.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú thêm">{selectedBooking.guestInfo.note || 'Không có'}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="🏢 Thông Tin Đặt Phòng" column={1} bordered size="small">
              <Descriptions.Item label="Cơ sở lưu trú">{selectedBooking.propertyName}</Descriptions.Item>
              <Descriptions.Item label="Loại phòng">{selectedBooking.roomTypeName}</Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {selectedBooking.checkIn} đến {selectedBooking.checkOut} ({selectedBooking.nights} đêm)
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng khách">{selectedBooking.guests} người</Descriptions.Item>
              <Descriptions.Item label="Đơn giá/đêm">{formatCurrency(selectedBooking.pricePerNight)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo đơn">{selectedBooking.createdAt}</Descriptions.Item>
            </Descriptions>

            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              {selectedBooking.status === 'pending' && (
                <Button
                  type="primary"
                  block
                  className="bg-blue-600"
                  onClick={() => updateBookingStatus(selectedBooking.code, 'confirmed')}
                >
                  Xác Nhận Đơn Này
                </Button>
              )}
              {selectedBooking.status === 'confirmed' && (
                <Button
                  type="primary"
                  block
                  className="bg-emerald-600 border-none"
                  onClick={() => updateBookingStatus(selectedBooking.code, 'completed')}
                >
                  Đánh Dấu Hoàn Thành
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Walk-in Booking Modal */}
      <Modal
        title="Tạo Đơn Đặt Phòng Mới (Tại Quầy / Walk-in)"
        open={isWalkInModalOpen}
        onCancel={() => setIsWalkInModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo đơn hàng"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateWalkInBooking} className="py-2">
          <Form.Item name="propertyId" label="Chọn Cơ sở lưu trú" rules={[{ required: true }]}>
            <Select placeholder="Chọn khách sạn / homestay">
              {INITIAL_PROPERTIES.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="roomTypeId" label="Chọn Loại phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại phòng">
              {INITIAL_PROPERTIES.flatMap((p) => p.roomTypes).map((rt) => (
                <Option key={rt.id} value={rt.id}>
                  {rt.name} - {formatCurrency(rt.pricePerNight)}/đêm
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Họ tên khách hàng" rules={[{ required: true }]}>
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input placeholder="0901234567" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input placeholder="khachhang@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="guests" label="Số khách">
                <InputNumber min={1} max={10} defaultValue={2} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nights" label="Số đêm lưu trú">
                <InputNumber min={1} max={30} defaultValue={2} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="note" label="Ghi chú của khách">
                <Input placeholder="Yêu cầu thêm..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
