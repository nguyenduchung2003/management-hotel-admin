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
  Rate,
  Popconfirm,
  message,
  Typography,
  Badge,
  Tooltip,
  Checkbox,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  StarFilled,
  CheckCircleOutlined,
  SyncOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  INITIAL_PROPERTIES,
  INITIAL_AMENITIES,
  type Property,
  type PropertyType,
} from '../mock/hotelAdminData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function PropertyManagementView() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Modal / Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [detailModalProperty, setDetailModalProperty] = useState<Property | null>(null);

  const [form] = Form.useForm();

  // Filtered properties
  const filteredProperties = properties.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.address.toLowerCase().includes(searchText.toLowerCase()) ||
      item.city.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCity = selectedCity === 'all' || item.city === selectedCity;

    return matchesSearch && matchesType && matchesCity;
  });

  const handleCreateOrUpdate = (values: any) => {
    if (editingProperty) {
      // Update
      const updated = properties.map((p) =>
        p.id === editingProperty.id
          ? {
              ...p,
              ...values,
              amenityIds: values.amenityIds || [],
            }
          : p
      );
      setProperties(updated);
      message.success(`Đã cập nhật thông tin "${values.name}" thành công!`);
    } else {
      // Create new
      const newProp: Property = {
        id: `prop-${Date.now()}`,
        slug: values.name.toLowerCase().replace(/\s+/g, '-'),
        name: values.name,
        type: values.type,
        city: values.city,
        address: values.address,
        description: values.description || '',
        images: values.imageUrl
          ? [values.imageUrl]
          : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        amenityIds: values.amenityIds || ['wifi', 'parking'],
        rating: 5.0,
        reviewCount: 0,
        checkInTime: values.checkInTime || '14:00',
        checkOutTime: values.checkOutTime || '12:00',
        cancellationPolicy: values.cancellationPolicy || 'Miễn phí hủy trước 3 ngày.',
        status: values.status || 'active',
        roomTypes: [],
      };
      setProperties([newProp, ...properties]);
      message.success(`Đã thêm cơ sở lưu trú mới "${values.name}" thành công!`);
    }

    setIsDrawerOpen(false);
    setEditingProperty(null);
    form.resetFields();
  };

  const handleDelete = (id: string, name: string) => {
    setProperties(properties.filter((p) => p.id !== id));
    message.success(`Đã xóa cơ sở lưu trú "${name}"`);
  };

  const openEditDrawer = (property: Property) => {
    setEditingProperty(property);
    form.setFieldsValue({
      name: property.name,
      type: property.type,
      city: property.city,
      address: property.address,
      description: property.description,
      status: property.status,
      checkInTime: property.checkInTime,
      checkOutTime: property.checkOutTime,
      cancellationPolicy: property.cancellationPolicy,
      amenityIds: property.amenityIds,
      imageUrl: property.images[0],
    });
    setIsDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setEditingProperty(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'hotel',
      city: 'Đà Nẵng',
      status: 'active',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      amenityIds: ['wifi', 'parking', 'breakfast', 'air-conditioner'],
    });
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Cơ sở lưu trú',
      key: 'property',
      render: (_: any, record: Property) => (
        <div className="flex items-center gap-3">
          <img
            src={record.images[0]}
            alt={record.name}
            className="w-16 h-12 object-cover rounded-lg shadow-xs"
          />
          <div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {record.name}
              <Tag color={record.type === 'hotel' ? 'blue' : 'purple'} className="m-0 text-[11px]">
                {record.type === 'hotel' ? 'Khách Sạn' : 'Homestay'}
              </Tag>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <EnvironmentOutlined className="text-red-500" /> {record.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      render: (city: string) => <Tag color="cyan">{city}</Tag>,
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_: any, record: Property) => (
        <div className="flex items-center gap-1">
          <StarFilled className="text-amber-400 text-xs" />
          <span className="font-bold text-sm">{record.rating}</span>
          <span className="text-xs text-gray-400">({record.reviewCount})</span>
        </div>
      ),
    },
    {
      title: 'Số loại phòng',
      key: 'roomTypesCount',
      render: (_: any, record: Property) => (
        <Badge count={`${record.roomTypes.length} loại phòng`} showZero color="blue" />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Property['status']) => {
        if (status === 'active') return <Tag color="success" icon={<CheckCircleOutlined />}>Hoạt động</Tag>;
        if (status === 'maintenance') return <Tag color="warning" icon={<SyncOutlined spin />}>Bảo trì</Tag>;
        return <Tag color="error" icon={<StopOutlined />}>Tạm ngưng</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Property) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết & danh sách phòng">
            <Button
              type="text"
              icon={<EyeOutlined className="text-blue-600" />}
              onClick={() => setDetailModalProperty(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-amber-600" />}
              onClick={() => openEditDrawer(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc muốn xóa "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa cơ sở">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            🏢 Quản Lý Khách Sạn & Homestay
          </Title>
          <Text type="secondary" className="text-xs">
            Quản lý danh sách, địa chỉ, tiện ích và trạng thái hoạt động của các cơ sở lưu trú.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreateDrawer}>
          Thêm cơ sở mới
        </Button>
      </div>

      {/* Filter toolbar */}
      <Card className="border-none shadow-sm rounded-xl">
        <Row gutter={[16, 16]} items-center>
          <Col xs={24} sm={10} md={10}>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm kiếm theo tên cơ sở, địa chỉ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={7} md={7}>
            <Select
              className="w-full"
              value={selectedType}
              onChange={(val) => setSelectedType(val)}
            >
              <Option value="all">Tất cả loại hình (Hotel & Homestay)</Option>
              <Option value="hotel">Khách sạn (Hotel)</Option>
              <Option value="homestay">Homestay</Option>
            </Select>
          </Col>
          <Col xs={12} sm={7} md={7}>
            <Select
              className="w-full"
              value={selectedCity}
              onChange={(val) => setSelectedCity(val)}
            >
              <Option value="all">Tất cả thành phố</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
              <Option value="Đà Lạt">Đà Lạt</Option>
              <Option value="Phú Quốc">Phú Quốc</Option>
              <Option value="Hà Nội">Hà Nội</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card className="border-none shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredProperties}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* Drawer Create / Edit */}
      <Drawer
        title={editingProperty ? `Chỉnh sửa: ${editingProperty.name}` : 'Thêm mới Cơ sở lưu trú'}
        width={600}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {editingProperty ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="name" label="Tên cơ sở lưu trú" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: Furama Resort Đà Nẵng" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select>
                  <Option value="hotel">Khách Sạn (Hotel)</Option>
                  <Option value="homestay">Homestay</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="Thành phố / Tỉnh" rules={[{ required: true }]}>
                <Select>
                  <Option value="Đà Nẵng">Đà Nẵng</Option>
                  <Option value="Đà Lạt">Đà Lạt</Option>
                  <Option value="Phú Quốc">Phú Quốc</Option>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="TP.HCM">TP.HCM</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input placeholder="Số nhà, đường, quận/huyện..." />
          </Form.Item>

          <Form.Item name="imageUrl" label="URL Hình ảnh minh họa">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="checkInTime" label="Giờ check-in">
                <Input placeholder="14:00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkOutTime" label="Giờ check-out">
                <Input placeholder="12:00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="maintenance">Bảo trì</Option>
                  <Option value="inactive">Tạm ngưng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="cancellationPolicy" label="Chính sách hủy phòng">
            <Input.TextArea rows={2} placeholder="Nhập quy định hủy phòng..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả giới thiệu">
            <Input.TextArea rows={3} placeholder="Mô tả nổi bật về không gian, vị trí..." />
          </Form.Item>

          <Form.Item name="amenityIds" label="Các tiện ích cung cấp">
            <Checkbox.Group className="w-full">
              <Row gutter={[8, 8]}>
                {INITIAL_AMENITIES.map((am) => (
                  <Col span={12} key={am.id}>
                    <Checkbox value={am.id}>{am.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Detail Modal */}
      {detailModalProperty && (
        <Modal
          title={
            <div className="flex items-center gap-2">
              <HomeOutlined className="text-blue-600" />
              <span>{detailModalProperty.name}</span>
            </div>
          }
          open={!!detailModalProperty}
          onCancel={() => setDetailModalProperty(null)}
          footer={[
            <Button key="close" type="primary" onClick={() => setDetailModalProperty(null)}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          <div className="space-y-4 py-2">
            <img
              src={detailModalProperty.images[0]}
              alt={detailModalProperty.name}
              className="w-full h-56 object-cover rounded-xl shadow-xs"
            />
            <div className="flex justify-between items-start">
              <div>
                <Text type="secondary" className="text-xs">
                  {detailModalProperty.address}
                </Text>
                <div className="flex items-center gap-2 mt-1">
                  <Tag color="blue">{detailModalProperty.type.toUpperCase()}</Tag>
                  <Tag color="cyan">{detailModalProperty.city}</Tag>
                </div>
              </div>
              <div className="text-right">
                <Rate disabled defaultValue={detailModalProperty.rating} className="text-sm" />
                <div className="text-xs text-gray-400">{detailModalProperty.reviewCount} đánh giá từ khách</div>
              </div>
            </div>

            <Paragraph className="text-slate-600 dark:text-slate-300 text-sm">
              {detailModalProperty.description}
            </Paragraph>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <Text strong className="block mb-2 text-sm">
                🛏️ Các Loại Phòng Thuộc Cơ Sở ({detailModalProperty.roomTypes.length}):
              </Text>
              {detailModalProperty.roomTypes.length > 0 ? (
                <div className="space-y-2">
                  {detailModalProperty.roomTypes.map((rt) => (
                    <div
                      key={rt.id}
                      className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{rt.name}</div>
                        <div className="text-gray-400">
                          {rt.bedType} • {rt.areaM2}m² • Tối đa {rt.maxGuests} khách
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            rt.pricePerNight
                          )}
                          /đêm
                        </div>
                        <div className="text-gray-400">Còn {rt.availableRooms}/{rt.totalRooms} phòng</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Text type="secondary" className="text-xs italic">
                  Chưa có loại phòng nào được tạo cho cơ sở này.
                </Text>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
