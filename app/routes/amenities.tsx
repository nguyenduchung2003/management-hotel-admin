import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  message,
  Typography,
  Badge,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  WifiOutlined,
  CarOutlined,
  SkinOutlined,
  CoffeeOutlined,
  ControlOutlined,
  FireOutlined,
  SyncOutlined,
  HeartOutlined,
  SmileOutlined,
  TrophyOutlined,
  CustomerServiceOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { INITIAL_AMENITIES, type Amenity } from '../mock/hotelAdminData';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AmenityManagementView() {
  const [amenities, setAmenities] = useState<Amenity[]>(INITIAL_AMENITIES);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [form] = Form.useForm();

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'WifiOutlined':
        return <WifiOutlined className="text-blue-500" />;
      case 'CarOutlined':
        return <CarOutlined className="text-indigo-500" />;
      case 'SkinOutlined':
        return <SkinOutlined className="text-cyan-500" />;
      case 'CoffeeOutlined':
        return <CoffeeOutlined className="text-amber-600" />;
      case 'ControlOutlined':
        return <ControlOutlined className="text-emerald-500" />;
      case 'FireOutlined':
        return <FireOutlined className="text-red-500" />;
      case 'SyncOutlined':
        return <SyncOutlined className="text-teal-500" />;
      case 'HeartOutlined':
        return <HeartOutlined className="text-pink-500" />;
      case 'SmileOutlined':
        return <SmileOutlined className="text-orange-500" />;
      case 'TrophyOutlined':
        return <TrophyOutlined className="text-purple-500" />;
      case 'CustomerServiceOutlined':
        return <CustomerServiceOutlined className="text-blue-600" />;
      default:
        return <EyeOutlined className="text-blue-500" />;
    }
  };

  const handleSaveAmenity = (values: any) => {
    if (editingAmenity) {
      const updated = amenities.map((a) =>
        a.id === editingAmenity.id ? { ...a, ...values } : a
      );
      setAmenities(updated);
      message.success(`Đã cập nhật tiện ích "${values.label}"!`);
    } else {
      const newAmenity: Amenity = {
        id: values.label.toLowerCase().replace(/\s+/g, '-'),
        label: values.label,
        category: values.category,
        icon: values.icon || 'WifiOutlined',
      };
      setAmenities([...amenities, newAmenity]);
      message.success(`Đã thêm tiện ích mới "${values.label}"!`);
    }

    setIsModalOpen(false);
    setEditingAmenity(null);
    form.resetFields();
  };

  const handleDelete = (id: string, label: string) => {
    setAmenities(amenities.filter((a) => a.id !== id));
    message.success(`Đã xóa tiện ích "${label}"!`);
  };

  const filteredAmenities = amenities.filter((a) => {
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesSearch = a.label.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            🛠️ Tiện Ích & Dịch Vụ
          </Title>
          <Text type="secondary" className="text-xs">
            Danh mục các dịch vụ, tiện nghi phòng ở, giải trí dùng chung cho Khách sạn & Homestay.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingAmenity(null);
            form.resetFields();
            form.setFieldsValue({ category: 'Tiện ích chung', icon: 'WifiOutlined' });
            setIsModalOpen(true);
          }}
        >
          Thêm tiện ích mới
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="border-none shadow-sm rounded-xl">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm theo tên tiện ích..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              className="w-full"
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
            >
              <Option value="all">Tất cả danh mục</Option>
              <Option value="Tiện ích chung">Tiện ích chung</Option>
              <Option value="Dịch vụ">Dịch vụ</Option>
              <Option value="Giải trí">Giải trí</Option>
              <Option value="Phòng ở">Phòng ở</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Grid of Cards */}
      <Row gutter={[16, 16]}>
        {filteredAmenities.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              className="card-hover-effect border-none shadow-xs rounded-xl h-full"
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined className="text-amber-600" />}
                  key="edit"
                  onClick={() => {
                    setEditingAmenity(item);
                    form.setFieldsValue({
                      label: item.label,
                      category: item.category,
                      icon: item.icon,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </Button>,
                <Popconfirm
                  title="Xóa tiện ích này?"
                  onConfirm={() => handleDelete(item.id, item.label)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  key="delete"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-xl shadow-xs">
                  {getAmenityIcon(item.icon)}
                </div>
                <Tag color="blue" className="m-0 text-[11px]">
                  {item.category}
                </Tag>
              </div>

              <div className="mt-4">
                <div className="font-bold text-base text-slate-800 dark:text-slate-100">
                  {item.label}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">ID: {item.id}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add / Edit Modal */}
      <Modal
        title={editingAmenity ? `Sửa tiện ích: ${editingAmenity.label}` : 'Thêm Tiện Ích / Dịch Vụ Mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingAmenity ? 'Lưu thay đổi' : 'Tạo mới'}
        cancelText="Hủy"
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAmenity} className="py-2">
          <Form.Item name="label" label="Tên tiện ích / Dịch vụ" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Bãi đỗ xe miễn phí" />
          </Form.Item>

          <Form.Item name="category" label="Phân loại danh mục" rules={[{ required: true }]}>
            <Select>
              <Option value="Tiện ích chung">Tiện ích chung</Option>
              <Option value="Dịch vụ">Dịch vụ</Option>
              <Option value="Giải trí">Giải trí</Option>
              <Option value="Phòng ở">Phòng ở</Option>
            </Select>
          </Form.Item>

          <Form.Item name="icon" label="Biểu tượng Icon">
            <Select>
              <Option value="WifiOutlined">Wi-Fi (WifiOutlined)</Option>
              <Option value="CarOutlined">Bãi đỗ xe (CarOutlined)</Option>
              <Option value="SkinOutlined">Bể bơi (SkinOutlined)</Option>
              <Option value="CoffeeOutlined">Ăn sáng (CoffeeOutlined)</Option>
              <Option value="ControlOutlined">Điều hòa (ControlOutlined)</Option>
              <Option value="FireOutlined">Bếp / BBQ (FireOutlined)</Option>
              <Option value="SyncOutlined">Máy giặt (SyncOutlined)</Option>
              <Option value="HeartOutlined">Thú cưng (HeartOutlined)</Option>
              <Option value="CustomerServiceOutlined">Lễ tân 24/7 (CustomerServiceOutlined)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
