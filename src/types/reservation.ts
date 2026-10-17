// Contract gốc lấy từ fe/src/types/reservation.ts. Admin mở rộng thêm trạng thái vận hành
// (checked_in / checked_out / no_show), hoàn tiền, nguồn đặt, ghi chú nội bộ và lịch sử thao tác.

export interface Addon {
	id: string;
	name: string;
	price: number;
	unit: 'per_stay' | 'per_night';
}

export interface Promotion {
	code: string;
	label: string;
	type: 'percent' | 'fixed';
	value: number;
	minNights: number;
}

export interface QuoteLine {
	label: string;
	amount: number;
}

export interface BookingQuote {
	nights: number;
	pricePerNight: number;
	roomSubtotal: number;
	addonsTotal: number;
	discount: number;
	total: number;
	lines: QuoteLine[];
}

export type PaymentMethod = 'card' | 'vnpay' | 'momo' | 'pay_at_property';
export type ReservationStatus =
	| 'pending_payment'
	| 'confirmed'
	| 'checked_in'
	| 'checked_out'
	| 'cancelled'
	| 'no_show';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type ReservationSource = 'website' | 'phone' | 'walk_in' | 'ota';

export interface GuestDetails {
	title: 'mr' | 'ms';
	fullName: string;
	email: string;
	phone: string;
	country: string;
	arrivalTime: string;
	specialRequest?: string;
}

export type ReservationAction =
	| 'created'
	| 'updated'
	| 'payment_confirmed'
	| 'checked_in'
	| 'checked_out'
	| 'cancelled'
	| 'no_show';

export interface ReservationEvent {
	at: string;
	action: ReservationAction;
	actor: string;
	note?: string;
}

export interface Reservation {
	code: string;
	status: ReservationStatus;
	paymentStatus: PaymentStatus;
	paymentMethod: PaymentMethod;
	source: ReservationSource;
	roomId: string;
	roomSlug: string;
	roomName: string;
	roomImage: string;
	ratePlanId: string;
	ratePlanName: string;
	refundable: boolean;
	/** Hạn huỷ miễn phí (YYYY-MM-DD), null nếu không hoàn huỷ. */
	freeCancelUntil: string | null;
	checkIn: string;
	checkOut: string;
	nights: number;
	adults: number;
	children: number;
	addons: { id: string; name: string; amount: number }[];
	promoCode?: string;
	guest: GuestDetails;
	quote: BookingQuote;
	internalNote?: string;
	cancelReason?: string;
	history: ReservationEvent[];
	createdAt: string;
	updatedAt: string;
}

// ---- Admin API ----

export type ReservationDateField = 'checkIn' | 'checkOut' | 'createdAt';
export type ReservationSortField = 'checkIn' | 'createdAt' | 'total';
export type SortOrder = 'asc' | 'desc';

export interface ReservationListQuery {
	page: number;
	pageSize: number;
	keyword?: string;
	status?: ReservationStatus;
	paymentStatus?: PaymentStatus;
	roomId?: string;
	source?: ReservationSource;
	dateField?: ReservationDateField;
	/** YYYY-MM-DD, bao gồm cả 2 đầu. */
	dateFrom?: string;
	dateTo?: string;
	sortField?: ReservationSortField;
	sortOrder?: SortOrder;
}

export interface PagedResult<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ReservationStats {
	date: string;
	arrivalsToday: number;
	departuresToday: number;
	inHouse: number;
	pendingPayment: number;
	occupiedUnits: number;
	totalUnits: number;
	/** Tổng tiền các đặt phòng đã thanh toán có ngày nhận phòng trong tháng hiện tại. */
	revenueThisMonth: number;
	statusCounts: Record<ReservationStatus | 'all', number>;
}

export interface CalendarReservation {
	code: string;
	guestName: string;
	status: ReservationStatus;
	checkIn: string;
	checkOut: string;
}

export interface CalendarRoomRow {
	roomId: string;
	roomName: string;
	totalUnits: number;
	/** Cùng thứ tự với `CalendarData.dates`. */
	cells: { date: string; occupied: number; reservations: CalendarReservation[] }[];
}

export interface CalendarData {
	from: string;
	days: number;
	dates: string[];
	rooms: CalendarRoomRow[];
}

export interface QuoteRequest {
	roomId: string;
	ratePlanId: string;
	checkIn: string;
	checkOut: string;
	adults: number;
	children: number;
	addonIds: string[];
	promoCode?: string;
}

export interface QuoteResult {
	quote: BookingQuote;
	availableUnits: number;
	totalUnits: number;
	fitsGuests: boolean;
	promotionError: string | null;
}

export interface AdminCreateReservationInput extends QuoteRequest {
	guest: GuestDetails;
	paymentMethod: PaymentMethod;
	paymentStatus: Extract<PaymentStatus, 'unpaid' | 'paid'>;
	source: ReservationSource;
	internalNote?: string;
}

export interface UpdateReservationInput {
	guest?: GuestDetails;
	internalNote?: string;
}

export interface CancelReservationInput {
	reason: string;
	/** Chỉ có tác dụng khi đặt phòng đã thanh toán. */
	refund: boolean;
}
