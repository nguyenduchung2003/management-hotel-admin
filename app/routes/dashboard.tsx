import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Progress } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  PercentageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  AimOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarFilled,
  HomeOutlined,
  BookOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router';
import { INITIAL_PROPERTIES, INITIAL_BOOKINGS, INITIAL_ACTIVITIES, type Property, type SystemActivity } from '../mock/hotelAdminData';

const { Text } = Typography;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const activityTypeStyle: Record<SystemActivity['type'], { dot: string }> = {
  booking: { dot: 'bg-blue-500' },
  property: { dot: 'bg-purple-500' },
  user: { dot: 'bg-emerald-500' },
  system: { dot: 'bg-amber-500' },
};

export default function DashboardView() {
  const stats = useMemo(() => {
    const totalRooms = INITIAL_PROPERTIES.reduce(
      (sum, p) => sum + p.roomTypes.reduce((s, rt) => s + rt.totalRooms, 0),
      0
    );
    const availableRooms = INITIAL_PROPERTIES.reduce(
      (sum, p) => sum + p.roomTypes.reduce((s, rt) => s + rt.availableRooms, 0),
      0
    );
    const occupancyRate = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0;

    const activeBookings = INITIAL_BOOKINGS.filter((b) => b.status !== 'cancelled');
    const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const successRate = (activeBookings.length / INITIAL_BOOKINGS.length) * 100;

    const avgRating = INITIAL_PROPERTIES.reduce((sum, p) => sum + p.rating, 0) / INITIAL_PROPERTIES.length;

    const bookingCountByProperty = INITIAL_BOOKINGS.reduce<Record<string, number>>((acc, b) => {
      acc[b.propertyId] = (acc[b.propertyId] || 0) + 1;
      return acc;
    }, {});

    const topProperties = [...INITIAL_PROPERTIES]
      .map((p) => ({ ...p, bookingCount: bookingCountByProperty[p.id] || 0 }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    return { totalRooms, availableRooms, occupancyRate, totalRevenue, successRate, avgRating, topProperties };
  }, []);

  const columns = [
    {
      title: 'Cơ sở lưu trú',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Property) => (
        <div className="flex items-center gap-3 py-1">
          <img
            src={record.images[0]}
            alt={record.name}
            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
          />
          <div>
            <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-tight">
              {record.name}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{record.city}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
      render: (type: Property['type']) => (
        <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-md">
          {type === 'hotel' ? 'Khách Sạn' : 'Homestay'}
        </span>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_: any, record: Property) => (
        <span className="font-bold text-xs text-amber-600 flex items-center gap-1">
          <StarFilled className="text-[10px]" /> {record.rating}
          <span className="text-slate-400 font-normal">({record.reviewCount})</span>
        </span>
      ),
    },
    {
      title: 'Lượt đặt',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      align: 'center' as const,
      render: (count: number) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
          <FireOutlined className="text-amber-500 text-xs" /> {count}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Stat Cards Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-pastel-blue rounded-2xl shadow-2xs p-1">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-xs font-medium text-slate-500">
                  Tổng Doanh Thu
                </Text>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="flex items-center gap-1 text-[11px] mt-2">
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold">
                    <ArrowUpOutlined className="text-[10px]" /> +16.4%
                  </span>
                  <span className="text-slate-400 font-normal">so với tháng trước</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 text-lg shadow-2xs">
                <DollarOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-pastel-green rounded-2xl shadow-2xs p-1">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-xs font-medium text-slate-500">
                  Tổng Đặt Phòng
                </Text>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                  {INITIAL_BOOKINGS.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] mt-2">
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold">
                    <ArrowUpOutlined className="text-[10px]" /> +12.5%
                  </span>
                  <span className="text-slate-400 font-normal">so với tháng trước</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 text-lg shadow-2xs">
                <CalendarOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-pastel-purple rounded-2xl shadow-2xs p-1">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-xs font-medium text-slate-500">
                  Khách Hàng Mới
                </Text>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                  1.280
                </div>
                <div className="flex items-center gap-1 text-[11px] mt-2">
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold">
                    <ArrowUpOutlined className="text-[10px]" /> +8.9%
                  </span>
                  <span className="text-slate-400 font-normal">so với tháng trước</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 text-lg shadow-2xs">
                <UserAddOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-pastel-orange rounded-2xl shadow-2xs p-1">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-xs font-medium text-slate-500">
                  Tỷ Lệ Lấp Đầy Phòng
                </Text>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                  {stats.occupancyRate.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1 text-[11px] mt-2">
                  <span className="inline-flex items-center gap-0.5 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                    {stats.totalRooms - stats.availableRooms}/{stats.totalRooms} phòng
                  </span>
                  <span className="text-slate-400 font-normal">đang được sử dụng</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-600 text-lg shadow-2xs">
                <PercentageOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Middle Section (Chart + Completion Bar) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <RiseOutlined className="text-purple-500" />
                <span>Tăng trưởng Doanh thu theo Tháng (Triệu đ)</span>
              </div>
            }
            className="border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl h-full bg-white dark:bg-slate-900"
          >
            <div className="w-full h-64 relative flex flex-col justify-end pt-4">
              {/* SVG Area Line Chart */}
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

                {/* Area fill */}
                <path
                  d="M 20 130 C 100 120, 160 90, 230 70 C 300 50, 360 85, 450 40 C 530 0, 600 50, 680 20 L 680 160 L 20 160 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line path */}
                <path
                  d="M 20 130 C 100 120, 160 90, 230 70 C 300 50, 360 85, 450 40 C 530 0, 600 50, 680 20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data points */}
                <circle cx="20" cy="130" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="130" cy="100" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="240" cy="70" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="350" cy="80" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="460" cy="40" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="570" cy="45" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="680" cy="20" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
              </svg>

              {/* X-Axis Ticks */}
              <div className="flex justify-between px-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500">
                <span>T1</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <AimOutlined className="text-rose-500" />
                <span>Chỉ số Tỷ lệ Hoàn thành</span>
              </div>
            }
            className="border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl h-full bg-white dark:bg-slate-900"
          >
            <div className="space-y-6 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Mục tiêu Doanh thu Quý 3</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">82%</span>
                </div>
                <Progress percent={82} strokeColor="#3b82f6" showInfo={false} size="small" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Đặt phòng Hoàn tất (không hủy)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{stats.successRate.toFixed(1)}%</span>
                </div>
                <Progress percent={stats.successRate} strokeColor="#22c55e" showInfo={false} size="small" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Tỷ lệ hài lòng Khách hàng</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{((stats.avgRating / 5) * 100).toFixed(0)}%</span>
                </div>
                <Progress percent={(stats.avgRating / 5) * 100} strokeColor="#a855f7" showInfo={false} size="small" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section (Top Properties Table + Activity Log) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                  <FireOutlined className="text-amber-500" />
                  <span>Top Cơ sở Lưu trú Được Đánh giá Cao</span>
                </div>
                <Link to="/properties" className="text-xs text-blue-600 font-medium hover:underline">
                  Xem tất cả
                </Link>
              </div>
            }
            className="border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl bg-white dark:bg-slate-900"
          >
            <Table
              columns={columns}
              dataSource={stats.topProperties}
              rowKey="id"
              pagination={false}
              size="small"
              className="text-xs"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <ThunderboltOutlined className="text-amber-500" />
                <span>Hoạt động Hệ thống Gần đây</span>
              </div>
            }
            className="border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl h-full bg-white dark:bg-slate-900"
          >
            <div className="space-y-4 pt-1">
              {INITIAL_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3 relative pl-2">
                  <div className="mt-1 flex-shrink-0 relative">
                    <span className={`w-2.5 h-2.5 rounded-full block ${activityTypeStyle[act.type].dot}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                      <span className="text-blue-600">{act.user}</span> {act.action}{' '}
                      <span className="text-slate-500 font-normal">— {act.target}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {act.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
