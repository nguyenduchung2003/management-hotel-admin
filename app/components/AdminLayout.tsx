import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Input,
  Breadcrumb,
  Tooltip,
  Typography,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ToolOutlined,
  StarOutlined,
  HomeOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const routeNameMap: Record<string, string> = {
  '/': 'Tổng quan',
  '/bookings': 'Đặt phòng',
  '/properties': 'Cơ sở lưu trú',
  '/rooms': 'Loại phòng',
  '/amenities': 'Tiện ích & Dịch vụ',
  '/reviews': 'Đánh giá & Nhận xét',
  '/users': 'Người dùng & Phân quyền',
};


export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const currentPath = location.pathname;

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined className="text-blue-500" />,
      label: 'Tổng quan',
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: 'Đặt phòng',
    },
    {
      key: '/properties',
      icon: <HomeOutlined />,
      label: 'Cơ sở lưu trú',
    },
    {
      key: '/rooms',
      icon: <AppstoreOutlined />,
      label: 'Loại phòng',
    },
    {
      key: '/amenities',
      icon: <ToolOutlined />,
      label: 'Tiện ích & Dịch vụ',
    },
    {
      key: '/reviews',
      icon: <StarOutlined />,
      label: 'Đánh giá & Nhận xét',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Người dùng & Phân quyền',
    },
  ];

  const notificationMenu = {
    items: [
      {
        key: '1',
        label: (
          <div className="py-1 max-w-xs">
            <div className="font-semibold text-xs text-blue-600">ĐẶT PHÒNG MỚI</div>
            <div className="text-sm font-medium">Đơn BK-202609-8802 (Đà Lạt Pine Hill) đang chờ xác nhận</div>
            <div className="text-xs text-gray-400">10 phút trước</div>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div className="py-1 max-w-xs">
            <div className="font-semibold text-xs text-green-600">KHÁCH HÀNG MỚI</div>
            <div className="text-sm font-medium">Lê Hoàng Nam đã đăng ký tài khoản mới</div>
            <div className="text-xs text-gray-400">45 phút trước</div>
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div className="py-1 max-w-xs">
            <div className="font-semibold text-xs text-amber-600">ĐÁNH GIÁ MỚI</div>
            <div className="text-sm font-medium">Furama Resort Đà Nẵng vừa nhận đánh giá 5 sao</div>
            <div className="text-xs text-gray-400">2 giờ trước</div>
          </div>
        ),
      },
    ],
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Trang cá nhân',
      },
      {
        key: 'security',
        icon: <SafetyCertificateOutlined />,
        label: 'Cài đặt bảo mật',
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined className="text-red-500" />,
        label: <span className="text-red-500">Đăng xuất</span>,
        onClick: () => navigate('/'),
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        theme={isDarkMode ? 'dark' : 'light'}
        className="border-r border-slate-200 dark:border-slate-800 shadow-xs z-20"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shrink-0">
              <HomeOutlined />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight">
                  QLKS Admin
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Hotel & Homestay Portal</span>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="py-3 border-none text-sm font-medium"
        />
      </Sider>


      <Layout>
        <Header className="sticky top-0 z-10 px-6 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs transition-colors">
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-base text-slate-600"
            />
            <Breadcrumb
              items={[
                { title: <span className="text-slate-500 font-medium">Admin Hub</span> },
                { title: <span className="font-semibold text-slate-800 dark:text-slate-200">{routeNameMap[currentPath] || 'Tổng quan'}</span> },
              ]}
            />
          </div>

          <div className="flex items-center gap-4">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm nhanh..."
              className="w-56 hidden sm:flex rounded-full bg-slate-50/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
            />

            <Tooltip title={isDarkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}>
              <Button
                type="text"
                shape="circle"
                icon={isDarkMode ? <SunOutlined className="text-amber-400" /> : <MoonOutlined />}
                onClick={toggleDarkMode}
              />
            </Tooltip>

            <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']}>
              <Badge count={3} size="small" offset={[-2, 2]}>
                <Button type="text" shape="circle" icon={<BellOutlined />} />
              </Badge>
            </Dropdown>

            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="flex items-center gap-2.5 cursor-pointer pl-2 hover:opacity-85 transition-opacity">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss"
                  className="border border-slate-200 shadow-2xs w-8 h-8"
                />
                <div className="hidden md:flex flex-col text-left">
                  <Text strong className="text-xs leading-tight text-slate-800 dark:text-slate-100 font-semibold">
                    Quản Trị Viên Hệ Thống
                  </Text>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    admin@hotelmanagement.vn
                  </span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-[#f4f6f9] dark:bg-slate-950 min-h-[calc(100vh-120px)]">
          <Outlet />
        </Content>

        <Footer className="text-center py-3 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          QLKS Admin — Hệ Thống Quản Lý Khách Sạn & Homestay ©2026
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;


