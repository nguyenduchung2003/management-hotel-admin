import {
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, Button, ConfigProvider, Dropdown, Input, Layout, Menu } from 'antd'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { quickSearch } from '@/app/slices/reservationFiltersSlice'
import { setSiderCollapsed } from '@/app/slices/uiSlice'
import { loggedOut } from '@/app/slices/authSlice'
import { siderTheme } from '@/app/theme'

const { Sider, Header, Content } = Layout

const MENU = [
  { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Tổng quan</Link> },
  { key: '/dat-phong', icon: <ProfileOutlined />, label: <Link to="/dat-phong">Đặt phòng</Link> },
  { key: '/lich-phong', icon: <CalendarOutlined />, label: <Link to="/lich-phong">Lịch phòng</Link> },
]

function selectedKey(pathname: string): string {
  if (pathname.startsWith('/dat-phong')) return '/dat-phong'
  if (pathname.startsWith('/lich-phong')) return '/lich-phong'
  return '/'
}

export function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const collapsed = useAppSelector((state) => state.ui.siderCollapsed)
  const staff = useAppSelector((state) => state.auth.staff)
  // `broken` = màn hình hẹp (< lg): thanh bên chuyển thành ngăn kéo phủ lên nội dung.
  const [broken, setBroken] = useState(false)

  const toggle = () => dispatch(setSiderCollapsed(!collapsed))

  function handleLogout() {
    dispatch(loggedOut())
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  function handleQuickSearch(value: string) {
    dispatch(quickSearch(value.trim()))
    navigate('/dat-phong')
  }

  return (
    <Layout className="min-h-screen">
      {broken && !collapsed && (
        <div
          className="fixed inset-0 z-99 bg-black/45"
          onClick={() => dispatch(setSiderCollapsed(true))}
          aria-hidden="true"
        />
      )}
      <Sider
        width={240}
        collapsedWidth={broken ? 0 : 72}
        breakpoint="lg"
        onBreakpoint={(isBroken) => {
          setBroken(isBroken)
          dispatch(setSiderCollapsed(isBroken))
        }}
        collapsible
        trigger={null}
        collapsed={collapsed}
        style={
          broken
            ? { position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, overflow: 'auto' }
            : { position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }
        }
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold font-serif text-lg font-bold text-gold">
            H
          </span>
          {!collapsed && (
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-serif text-base font-bold tracking-wide text-white uppercase">
                Tên Homestay
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold uppercase">Quản trị</span>
            </span>
          )}
        </div>
        <ConfigProvider theme={siderTheme}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey(pathname)]}
            items={MENU}
            onClick={() => broken && dispatch(setSiderCollapsed(true))}
            className="border-0! bg-transparent! px-2"
          />
        </ConfigProvider>
      </Sider>

      <Layout>
        <Header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line px-4 md:px-6">
          <Button
            type="text"
            onClick={toggle}
            aria-label={collapsed ? 'Mở thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          {/* Thẻ bọc: class `hidden/md:block` đặt trực tiếp lên Input.Search sẽ phá layout nhóm input + nút */}
          <div className="hidden max-w-md flex-1 md:block">
            <Input.Search
              allowClear
              placeholder="Tìm mã đặt phòng, tên khách, số điện thoại…"
              onSearch={handleQuickSearch}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/dat-phong/moi">
              <Button type="primary" icon={<PlusOutlined />}>
                <span className="hidden sm:inline">Tạo đặt phòng</span>
              </Button>
            </Link>
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0"
                aria-label="Tài khoản"
              >
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#0F332C' }} />
                <span className="hidden text-sm font-medium text-ink lg:inline">{staff?.name}</span>
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-4 md:p-6">
          <div className="mx-auto max-w-360">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
