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
  message,
  Typography,
  Tabs,
  Avatar,
  Popconfirm,
  Checkbox,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { INITIAL_USERS, type UserAdmin, type UserRole } from '../mock/hotelAdminData';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserManagementView() {
  const [users, setUsers] = useState<UserAdmin[]>(INITIAL_USERS);
  const [searchText, setSearchText] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);
  const [form] = Form.useForm();

  const toggleUserStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? ('locked' as const) : ('active' as const) } : u
    );
    setUsers(updated);
    message.success('Đã cập nhật trạng thái tài khoản thành công!');
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter((u) => u.id !== id));
    message.success(`Đã xóa người dùng "${name}"!`);
  };

  const handleSaveUser = (values: any) => {
    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...values } : u
      );
      setUsers(updated);
      message.success(`Đã cập nhật người dùng "${values.fullName}"!`);
    } else {
      const newUser: UserAdmin = {
        id: `usr-${Date.now()}`,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.fullName}`,
        role: values.role,
        status: values.status || 'active',
        createdAt: '2026-09-12',
        lastLogin: 'Chưa bao giờ',
      };
      setUsers([newUser, ...users]);
      message.success(`Đã tạo người dùng mới "${values.fullName}"!`);
    }

    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase()) ||
      u.phone.includes(searchText);

    return matchesRole && matchesSearch;
  });

  const getRoleTag = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Tag color="red" icon={<SafetyCertificateOutlined />}>Quản Trị Viên</Tag>;
      case 'receptionist':
        return <Tag color="blue">Lễ Tân</Tag>;
      case 'customer':
        return <Tag color="green">Khách Hàng</Tag>;
    }
  };

  const userColumns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: any, record: UserAdmin) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} size="large" className="bg-slate-200" />
          <div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{record.fullName}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <span className="font-mono text-xs">{phone}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => getRoleTag(role),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'locked') =>
        status === 'active' ? (
          <Tag color="success">Hoạt động</Tag>
        ) : (
          <Tag color="error">Đã khóa</Tag>
        ),
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (txt: string) => <span className="text-xs text-gray-400">{txt}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: UserAdmin) => (
        <Space size="small">
          <Tooltip title={record.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <LockOutlined className="text-amber-600" /> : <UnlockOutlined className="text-emerald-600" />}
              onClick={() => toggleUserStatus(record.id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                setEditingUser(record);
                form.setFieldsValue({
                  fullName: record.fullName,
                  email: record.email,
                  phone: record.phone,
                  role: record.role,
                  status: record.status,
                });
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa người dùng"
            description={`Xóa người dùng "${record.fullName}"?`}
            onConfirm={() => handleDeleteUser(record.id, record.fullName)}
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

  // Matrix table data
  const permissionsMatrix = [
    { module: '🏢 Quản Lý Khách Sạn & Homestay', admin: true, manager: true, rec: false },
    { module: '🛏️ Quản Lý Loại Phòng & Đổi Giá', admin: true, manager: true, rec: false },
    { module: '📅 Xem & Xử Lý Đặt Phòng', admin: true, manager: true, rec: true },
    { module: '🔑 Check-in / Check-out Khách', admin: true, manager: true, rec: true },
    { module: '👥 Quản Lý Tài Khoản & Vai Trò', admin: true, manager: false, rec: false },
    { module: '📊 Báo Cáo Doanh Thu Systems', admin: true, manager: true, rec: false },
    { module: '⭐ Phản Hồi Đánh Giá Khách Hàng', admin: true, manager: true, rec: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            👥 Người Dùng & Phân Quyền
          </Title>
          <Text type="secondary" className="text-xs">
            Quản lý tài khoản quản trị viên, nhân viên lễ tân, khách hàng và ma trận phân quyền hệ thống.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            form.setFieldsValue({ role: 'receptionist', status: 'active' });
            setIsModalOpen(true);
          }}
        >
          Thêm người dùng mới
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-xl">
        <Tabs
          items={[
            {
              key: 'users-list',
              label: '📋 Danh Sách Người Dùng',
              children: (
                <div className="space-y-4 pt-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Tìm kiếm tên, email, SĐT..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Select
                        className="w-full"
                        value={roleFilter}
                        onChange={(val) => setRoleFilter(val)}
                      >
                        <Option value="all">Tất cả vai trò</Option>
                        <Option value="admin">Quản trị viên (Admin)</Option>
                        <Option value="receptionist">Nhân viên lễ tân</Option>
                        <Option value="customer">Khách hàng</Option>
                      </Select>
                    </Col>
                  </Row>

                  <Table
                    columns={userColumns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    pagination={{ pageSize: 6 }}
                  />
                </div>
              ),
            },
            {
              key: 'permissions-matrix',
              label: '🛡️ Ma Trận Phân Quyền Vai Trò',
              children: (
                <div className="py-2">
                  <Table
                    dataSource={permissionsMatrix}
                    rowKey="module"
                    pagination={false}
                    columns={[
                      {
                        title: 'Chức năng / Module',
                        dataIndex: 'module',
                        key: 'module',
                        render: (text: string) => <span className="font-semibold text-sm">{text}</span>,
                      },
                      {
                        title: 'Super Admin',
                        key: 'admin',
                        align: 'center',
                        render: () => <Checkbox checked disabled className="scale-110" />,
                      },
                      {
                        title: 'Manager (Quản lý cở sở)',
                        key: 'manager',
                        align: 'center',
                        render: (_: any, record: any) => <Checkbox defaultChecked={record.manager} />,
                      },
                      {
                        title: 'Lễ Tân (Receptionist)',
                        key: 'rec',
                        align: 'center',
                        render: (_: any, record: any) => <Checkbox defaultChecked={record.rec} />,
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal Add/Edit User */}
      <Modal
        title={editingUser ? `Chỉnh sửa: ${editingUser.fullName}` : 'Thêm Người Dùng Mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingUser ? 'Lưu thay đổi' : 'Tạo mới'}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUser} className="py-2">
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="user@gmail.com" />
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
              <Form.Item name="role" label="Gán Vai trò" rules={[{ required: true }]}>
                <Select>
                  <Option value="admin">Quản trị viên (Admin)</Option>
                  <Option value="receptionist">Lễ tân</Option>
                  <Option value="customer">Khách hàng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="locked">Khóa tài khoản</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
