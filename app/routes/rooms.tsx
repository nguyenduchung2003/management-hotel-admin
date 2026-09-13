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
  Form,
  InputNumber,
  message,
  Typography,
  Badge,
  Tooltip,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { INITIAL_PROPERTIES, type RoomType } from '../mock/hotelAdminData';

const { Title, Text } = Typography;
const { Option } = Select;

// Collect initial room types from all properties
const initialRoomTypes: RoomType[] = INITIAL_PROPERTIES.flatMap((p) => p.roomTypes);

export default function RoomManagementView() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [form] = Form.useForm();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const filteredRoomTypes = roomTypes.filter((rt) => {
    const matchesProperty = selectedPropertyId === 'all' || rt.propertyId === selectedPropertyId;
    const matchesSearch =
      rt.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (rt.propertyName && rt.propertyName.toLowerCase().includes(searchText.toLowerCase()));
    return matchesProperty && matchesSearch;
  });

  const handleSave = (values: any) => {
    const targetProp = INITIAL_PROPERTIES.find((p) => p.id === values.propertyId);
    const propName = targetProp ? targetProp.name : 'Cơ sở lưu trú';

    if (editingRoom) {
      // Update
      const updated = roomTypes.map((rt) =>
        rt.id === editingRoom.id
          ? {
              ...rt,
              ...values,
              propertyName: propName,
            }
          : rt
      );
      setRoomTypes(updated);
      message.success(`Đã cập nhật loại phòng "${values.name}"!`);
    } else {
      // Create
      const newRoom: RoomType = {
        id: `rt-${Date.now()}`,
        propertyId: values.propertyId,
        propertyName: propName,
        name: values.name,
        description: values.description || '',
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        maxGuests: values.maxGuests,
        bedType: values.bedType || '1 Giường King',
        areaM2: values.areaM2 || 35,
        amenityIds: ['wifi', 'air-conditioner'],
        pricePerNight: values.pricePerNight,
        totalRooms: values.totalRooms,
        availableRooms: values.availableRooms || values.totalRooms,
      };
      setRoomTypes([newRoom, ...roomTypes]);
      message.success(`Đã thêm loại phòng mới "${values.name}"!`);
    }

    setIsModalOpen(false);
    setEditingRoom(null);
    form.resetFields();
  };

  const handleDelete = (id: string, name: string) => {
    setRoomTypes(roomTypes.filter((rt) => rt.id !== id));
    message.success(`Đã xóa loại phòng "${name}"`);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    form.resetFields();
    form.setFieldsValue({
      propertyId: INITIAL_PROPERTIES[0].id,
      maxGuests: 2,
      pricePerNight: 1500000,
      totalRooms: 10,
      availableRooms: 10,
      areaM2: 35,
      bedType: '1 Giường King',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: RoomType) => {
    setEditingRoom(room);
    form.setFieldsValue({
      propertyId: room.propertyId,
      name: room.name,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      bedType: room.bedType,
      areaM2: room.areaM2,
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
      description: room.description,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Tên loại phòng',
      key: 'name',
      render: (_: any, record: RoomType) => (
        <div>
          <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{record.name}</div>
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-0.5">
            <HomeOutlined /> {record.propertyName || 'Cơ sở lưu trú'}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá theo đêm',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (val: number) => <Text strong className="text-emerald-600 text-sm">{formatCurrency(val)}</Text>,
    },
    {
      title: 'Sức chứa & Diện tích',
      key: 'capacity',
      render: (_: any, record: RoomType) => (
        <div className="text-xs space-y-1">
          <div>
            <UserOutlined className="text-blue-500 mr-1" />
            <span>Tối đa {record.maxGuests} khách</span>
          </div>
          <div className="text-gray-400">
            {record.bedType} • {record.areaM2}m²
          </div>
        </div>
      ),
    },
    {
      title: 'Phòng trống / Tổng số',
      key: 'roomsCount',
      render: (_: any, record: RoomType) => (
        <div className="flex items-center gap-2">
          <Badge
            status={record.availableRooms > 0 ? 'success' : 'error'}
            text={<span className="font-semibold text-xs">{record.availableRooms} / {record.totalRooms} phòng trống</span>}
          />
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: RoomType) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa giá & thông tin">
            <Button
              type="text"
              icon={<EditOutlined className="text-amber-600" />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa loại phòng"
            description={`Bạn có chắc muốn xóa loại phòng "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
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
            🛏️ Quản Lý Loại Phòng
          </Title>
          <Text type="secondary" className="text-xs">
            Quản lý cấu hình các loại phòng, thiết lập giá theo đêm, sức chứa và số lượng phòng khả dụng.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreateModal}>
          Thêm loại phòng mới
        </Button>
      </div>

      {/* Filter toolbar */}
      <Card className="border-none shadow-sm rounded-xl">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm theo tên phòng hoặc tên cơ sở..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              className="w-full"
              value={selectedPropertyId}
              onChange={(val) => setSelectedPropertyId(val)}
            >
              <Option value="all">Tất cả Cơ sở lưu trú</Option>
              {INITIAL_PROPERTIES.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredRoomTypes}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal Add / Edit */}
      <Modal
        title={editingRoom ? `Sửa loại phòng: ${editingRoom.name}` : 'Thêm Loại Phòng Mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingRoom ? 'Lưu thay đổi' : 'Tạo mới'}
        cancelText="Hủy"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="py-2">
          <Form.Item name="propertyId" label="Cơ sở lưu trú" rules={[{ required: true, message: 'Vui lòng chọn cơ sở!' }]}>
            <Select>
              {INITIAL_PROPERTIES.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Tên loại phòng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: Deluxe Ocean View Room" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="pricePerNight" label="Giá theo đêm (VND)" rules={[{ required: true }]}>
                <InputNumber
                  className="w-full"
                  step={100000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxGuests" label="Số khách tối đa" rules={[{ required: true }]}>
                <InputNumber min={1} max={20} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="bedType" label="Loại giường">
                <Input placeholder="1 Giường King" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaM2" label="Diện tích (m²)">
                <InputNumber min={10} max={500} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalRooms" label="Tổng số phòng" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="availableRooms" label="Số phòng hiện khả dụng">
            <InputNumber min={0} max={100} className="w-full" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={3} placeholder="Đặc điểm không gian, nội thất phòng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
