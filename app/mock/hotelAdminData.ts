export type PropertyType = 'hotel' | 'homestay';

export type AmenityId =
  | 'wifi'
  | 'parking'
  | 'pool'
  | 'breakfast'
  | 'air-conditioner'
  | 'kitchen'
  | 'washer'
  | 'pet-friendly'
  | 'bbq'
  | 'gym'
  | 'front-desk-24h'
  | 'view';

export interface Amenity {
  id: AmenityId;
  label: string;
  category: 'Tiện ích chung' | 'Dịch vụ' | 'Giải trí' | 'Phòng ở';
  icon: string;
}

export interface RoomType {
  id: string;
  propertyId: string;
  propertyName?: string;
  name: string;
  description: string;
  images: string[];
  maxGuests: number;
  bedType: string;
  areaM2: number;
  amenityIds: AmenityId[];
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
}

export interface Review {
  id: string;
  propertyId: string;
  propertyName?: string;
  guestName: string;
  avatar: string;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  type: PropertyType;
  city: string;
  address: string;
  description: string;
  images: string[];
  amenityIds: AmenityId[];
  rating: number;
  reviewCount: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  status: 'active' | 'maintenance' | 'inactive';
  roomTypes: RoomType[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface GuestInfo {
  fullName: string;
  phone: string;
  email: string;
  note?: string;
}

export interface Booking {
  code: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  propertyImage: string;
  roomTypeId: string;
  roomTypeName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  totalPrice: number;
  status: BookingStatus;
  guestInfo: GuestInfo;
  createdAt: string;
}

export type UserRole = 'admin' | 'receptionist' | 'customer';

export interface UserAdmin {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: 'active' | 'locked';
  createdAt: string;
  lastLogin: string;
}

export interface SystemActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'booking' | 'property' | 'user' | 'system';
}

// Master Amenities List
export const INITIAL_AMENITIES: Amenity[] = [
  { id: 'wifi', label: 'Wi-Fi Tốc độ cao', category: 'Tiện ích chung', icon: 'WifiOutlined' },
  { id: 'parking', label: 'Bãi đỗ xe miễn phí', category: 'Tiện ích chung', icon: 'CarOutlined' },
  { id: 'pool', label: 'Bể bơi ngoài trời', category: 'Giải trí', icon: 'SkinOutlined' },
  { id: 'breakfast', label: 'Ăn sáng buffet', category: 'Dịch vụ', icon: 'CoffeeOutlined' },
  { id: 'air-conditioner', label: 'Điều hòa 2 chiều', category: 'Phòng ở', icon: 'ControlOutlined' },
  { id: 'kitchen', label: 'Bếp ăn đầy đủ đồ', category: 'Phòng ở', icon: 'FireOutlined' },
  { id: 'washer', label: 'Máy giặt & Sấy', category: 'Dịch vụ', icon: 'SyncOutlined' },
  { id: 'pet-friendly', label: 'Cho phép thú cưng', category: 'Dịch vụ', icon: 'HeartOutlined' },
  { id: 'bbq', label: 'Sân nướng BBQ', category: 'Giải trí', icon: 'SmileOutlined' },
  { id: 'gym', label: 'Phòng Gym & Fitness', category: 'Giải trí', icon: 'TrophyOutlined' },
  { id: 'front-desk-24h', label: 'Lễ tân 24/7', category: 'Dịch vụ', icon: 'CustomerServiceOutlined' },
  { id: 'view', label: 'View biển / Hướng núi', category: 'Phòng ở', icon: 'EyeOutlined' },
];

// Initial Properties & Room Types
export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    slug: 'furama-resort-danang',
    name: 'Furama Resort Đà Nẵng',
    type: 'hotel',
    city: 'Đà Nẵng',
    address: '105 Võ Nguyên Giáp, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng',
    description: 'Khu nghỉ dưỡng 5 sao đẳng cấp quốc tế tọa lạc ngay bãi biển Mỹ Khê danh tiếng với hồ bơi vô cực và khuôn viên xanh mát.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenityIds: ['wifi', 'parking', 'pool', 'breakfast', 'air-conditioner', 'gym', 'front-desk-24h', 'view'],
    rating: 4.9,
    reviewCount: 128,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Miễn phí hủy phòng trước 3 ngày so với ngày nhận phòng.',
    status: 'active',
    roomTypes: [
      {
        id: 'rt-101',
        propertyId: 'prop-1',
        propertyName: 'Furama Resort Đà Nẵng',
        name: 'Deluxe Ocean View Room',
        description: 'Phòng hướng biển sang trọng với ban công riêng rộng rãi.',
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 2,
        bedType: '1 Giường King Super',
        areaM2: 45,
        amenityIds: ['wifi', 'air-conditioner', 'view', 'breakfast'],
        pricePerNight: 3500000,
        totalRooms: 20,
        availableRooms: 14,
      },
      {
        id: 'rt-102',
        propertyId: 'prop-1',
        propertyName: 'Furama Resort Đà Nẵng',
        name: 'Executive Beachfront Suite',
        description: 'Suite thượng hạng nối thẳng ra bãi cát trắng mịn.',
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 4,
        bedType: '2 Giường Đôi King',
        areaM2: 85,
        amenityIds: ['wifi', 'air-conditioner', 'view', 'breakfast', 'pool'],
        pricePerNight: 6800000,
        totalRooms: 10,
        availableRooms: 5,
      },
    ],
  },
  {
    id: 'prop-2',
    slug: 'dalat-pine-hill-homestay',
    name: 'Đà Lạt Pine Hill Homestay',
    type: 'homestay',
    city: 'Đà Lạt',
    address: 'Triệu Việt Vương, Phường 4, TP. Đà Lạt, Lâm Đồng',
    description: 'Homestay ẩn mình giữa đồi thông thơ mộng, thiết kế gỗ ấm cúng, thích hợp cho nhóm bạn & gia đình muốn tìm khoảng trời bình yên.',
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
    amenityIds: ['wifi', 'parking', 'kitchen', 'pet-friendly', 'bbq', 'view'],
    rating: 4.8,
    reviewCount: 94,
    checkInTime: '13:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Hoàn 50% chi phí khi hủy phòng trước 5 ngày.',
    status: 'active',
    roomTypes: [
      {
        id: 'rt-201',
        propertyId: 'prop-2',
        propertyName: 'Đà Lạt Pine Hill Homestay',
        name: 'Bungalow Đồi Thông Gỗ',
        description: 'Bungalow riêng biệt giữa rừng thông nguyên sinh.',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 2,
        bedType: '1 Giường Queen Wood',
        areaM2: 32,
        amenityIds: ['wifi', 'kitchen', 'view', 'bbq'],
        pricePerNight: 950000,
        totalRooms: 8,
        availableRooms: 4,
      },
      {
        id: 'rt-202',
        propertyId: 'prop-2',
        propertyName: 'Đà Lạt Pine Hill Homestay',
        name: 'Villa Nguyên Căn Sân Vườn',
        description: 'Căn villa 3 phòng ngủ đầy đủ tiện nghi BBQ ngoài trời.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 8,
        bedType: '3 Giường King',
        areaM2: 120,
        amenityIds: ['wifi', 'kitchen', 'bbq', 'parking', 'pet-friendly'],
        pricePerNight: 3200000,
        totalRooms: 3,
        availableRooms: 2,
      },
    ],
  },
  {
    id: 'prop-3',
    slug: 'phu-quoc-sunset-villa-resort',
    name: 'Phú Quốc Sunset Ocean Resort',
    type: 'hotel',
    city: 'Phú Quốc',
    address: 'Bãi Trường, Dương Tơ, TP. Phú Quốc, Kiên Giang',
    description: 'Resort đón hoàng hôn tuyệt đẹp tại Phú Quốc, sở hữu bể bơi vô cực tràn bờ biển và nhà hàng hải sản phong vị vùng miền.',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    amenityIds: ['wifi', 'pool', 'breakfast', 'air-conditioner', 'gym', 'front-desk-24h', 'view'],
    rating: 4.7,
    reviewCount: 76,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Không hoàn tiền khi hủy trong vòng 48h.',
    status: 'active',
    roomTypes: [
      {
        id: 'rt-301',
        propertyId: 'prop-3',
        propertyName: 'Phú Quốc Sunset Ocean Resort',
        name: 'Sunset Ocean Bungalow',
        description: 'Bungalow sát biển ngắm chọn hoàng hôn Phú Quốc.',
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 2,
        bedType: '1 Giường King',
        areaM2: 50,
        amenityIds: ['wifi', 'pool', 'view', 'breakfast'],
        pricePerNight: 2800000,
        totalRooms: 12,
        availableRooms: 6,
      },
    ],
  },
  {
    id: 'prop-4',
    slug: 'hanoi-old-quarter-boutique-hotel',
    name: 'Hà Nội Old Quarter Boutique Hotel',
    type: 'hotel',
    city: 'Hà Nội',
    address: '42 Hàng Bè, Hoàn Kiếm, Hà Nội',
    description: 'Khách sạn phong cách Indochine hoài cổ nằm ngay trung tâm Phố Cổ Hà Nội, cách Hồ Hoàn Kiếm 3 phút đi bộ.',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
    ],
    amenityIds: ['wifi', 'breakfast', 'air-conditioner', 'front-desk-24h'],
    rating: 4.6,
    reviewCount: 112,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Hủy phòng tự do trước 24h.',
    status: 'active',
    roomTypes: [
      {
        id: 'rt-401',
        propertyId: 'prop-4',
        propertyName: 'Hà Nội Old Quarter Boutique Hotel',
        name: 'Indochine Superior City View',
        description: 'Phòng nghỉ bài trí tinh tế hướng phố cổ sầm uất.',
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        maxGuests: 2,
        bedType: '1 Giường Queen',
        areaM2: 28,
        amenityIds: ['wifi', 'air-conditioner', 'breakfast'],
        pricePerNight: 1200000,
        totalRooms: 15,
        availableRooms: 9,
      },
    ],
  },
];

// Initial Bookings
export const INITIAL_BOOKINGS: Booking[] = [
  {
    code: 'BK-202609-8801',
    userId: 'usr-101',
    propertyId: 'prop-1',
    propertyName: 'Furama Resort Đà Nẵng',
    propertySlug: 'furama-resort-danang',
    propertyImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    roomTypeId: 'rt-101',
    roomTypeName: 'Deluxe Ocean View Room',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    nights: 3,
    guests: 2,
    pricePerNight: 3500000,
    totalPrice: 10500000,
    status: 'confirmed',
    guestInfo: {
      fullName: 'Nguyễn Văn Minh',
      phone: '0905123456',
      email: 'vanminh.nguyen@gmail.com',
      note: 'Yêu cầu phòng tầng cao, giường King.',
    },
    createdAt: '2026-09-10 14:30',
  },
  {
    code: 'BK-202609-8802',
    userId: 'usr-102',
    propertyId: 'prop-2',
    propertyName: 'Đà Lạt Pine Hill Homestay',
    propertySlug: 'dalat-pine-hill-homestay',
    propertyImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    roomTypeId: 'rt-202',
    roomTypeName: 'Villa Nguyên Căn Sân Vườn',
    checkIn: '2026-09-20',
    checkOut: '2026-09-22',
    nights: 2,
    guests: 6,
    pricePerNight: 3200000,
    totalPrice: 6400000,
    status: 'pending',
    guestInfo: {
      fullName: 'Trần Thị Thu Hà',
      phone: '0988776655',
      email: 'thuha.tran@yahoo.com',
      note: 'Đặt sẵn dụng cụ nướng BBQ tối 20/09.',
    },
    createdAt: '2026-09-11 09:15',
  },
  {
    code: 'BK-202609-8803',
    userId: 'usr-103',
    propertyId: 'prop-3',
    propertyName: 'Phú Quốc Sunset Ocean Resort',
    propertySlug: 'phu-quoc-sunset-villa-resort',
    propertyImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    roomTypeId: 'rt-301',
    roomTypeName: 'Sunset Ocean Bungalow',
    checkIn: '2026-09-05',
    checkOut: '2026-09-08',
    nights: 3,
    guests: 2,
    pricePerNight: 2800000,
    totalPrice: 8400000,
    status: 'completed',
    guestInfo: {
      fullName: 'Lê Hoàng Nam',
      phone: '0912345678',
      email: 'hoangnam.le@hotmail.com',
    },
    createdAt: '2026-09-01 16:45',
  },
  {
    code: 'BK-202609-8804',
    userId: 'usr-104',
    propertyId: 'prop-4',
    propertyName: 'Hà Nội Old Quarter Boutique Hotel',
    propertySlug: 'hanoi-old-quarter-boutique-hotel',
    propertyImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
    roomTypeId: 'rt-401',
    roomTypeName: 'Indochine Superior City View',
    checkIn: '2026-09-12',
    checkOut: '2026-09-13',
    nights: 1,
    guests: 2,
    pricePerNight: 1200000,
    totalPrice: 1200000,
    status: 'cancelled',
    guestInfo: {
      fullName: 'Phạm Anh Tuấn',
      phone: '0935112233',
      email: 'anhtuan.pham@gmail.com',
      note: 'Thay đổi lịch công tác đột xuất.',
    },
    createdAt: '2026-09-08 10:20',
  },
];

// Initial System Users
export const INITIAL_USERS: UserAdmin[] = [
  {
    id: 'usr-admin-1',
    fullName: 'Quản Trị Viên Hệ Thống',
    email: 'admin@hotelmanagement.vn',
    phone: '0901111222',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01',
    lastLogin: '2026-09-12 21:30',
  },
  {
    id: 'usr-rec-1',
    fullName: 'Võ Thanh Hương (Lễ Tân)',
    email: 'huong.vo@furamadanang.vn',
    phone: '0905999888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuongVo',
    role: 'receptionist',
    status: 'active',
    createdAt: '2025-06-15',
    lastLogin: '2026-09-12 18:10',
  },
  {
    id: 'usr-101',
    fullName: 'Nguyễn Văn Minh',
    email: 'vanminh.nguyen@gmail.com',
    phone: '0905123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VanMinh',
    role: 'customer',
    status: 'active',
    createdAt: '2026-02-10',
    lastLogin: '2026-09-10 14:28',
  },
  {
    id: 'usr-102',
    fullName: 'Trần Thị Thu Hà',
    email: 'thuha.tran@yahoo.com',
    phone: '0988776655',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuHa',
    role: 'customer',
    status: 'active',
    createdAt: '2026-03-22',
    lastLogin: '2026-09-11 09:12',
  },
];

// Initial Reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    propertyId: 'prop-1',
    propertyName: 'Furama Resort Đà Nẵng',
    guestName: 'Lê Hoàng Nam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangNam',
    rating: 5,
    comment: 'Dịch vụ tuyệt vời, hồ bơi cực đẹp và nhân viên lễ tân hỗ trợ nhiệt tình. Sẽ quay lại năm sau!',
    reply: 'Cảm ơn anh Nam đã dành thời gian đánh giá. Furama rất hân hạnh được phục vụ gia đình anh!',
    createdAt: '2026-09-08 19:20',
  },
  {
    id: 'rev-2',
    propertyId: 'prop-2',
    propertyName: 'Đà Lạt Pine Hill Homestay',
    guestName: 'Nguyễn Bảo Ngọc',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BaoNgoc',
    rating: 4.8,
    comment: 'Không gian yên tĩnh giữa rừng thông, không khí trong lành. Đồ ăn sáng ngon miệng và sân BBQ thoáng.',
    createdAt: '2026-09-04 11:15',
  },
];

// System Activities Timeline
export const INITIAL_ACTIVITIES: SystemActivity[] = [
  {
    id: 'act-1',
    user: 'Võ Thanh Hương',
    action: 'đã xác nhận đơn đặt phòng',
    target: 'BK-202609-8801 (Furama Resort)',
    timestamp: '10 phút trước',
    type: 'booking',
  },
  {
    id: 'act-2',
    user: 'Quản Trị Viên',
    action: 'đã cập nhật giá loại phòng',
    target: 'Deluxe Ocean View Room',
    timestamp: '45 phút trước',
    type: 'property',
  },
  {
    id: 'act-3',
    user: 'Trần Thị Thu Hà',
    action: 'đã tạo đơn đặt phòng mới',
    target: 'BK-202609-8802 (Đà Lạt Pine Hill)',
    timestamp: '2 giờ trước',
    type: 'booking',
  },
  {
    id: 'act-4',
    user: 'Quản Trị Viên',
    action: 'đã thêm nhân viên lễ tân mới',
    target: 'usr-rec-1',
    timestamp: '1 ngày trước',
    type: 'user',
  },
];
