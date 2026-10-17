import type {
	PaymentMethod,
	PaymentStatus,
	ReservationAction,
	ReservationSource,
	ReservationStatus,
} from '@/types/reservation';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	card: 'Thẻ tín dụng / ghi nợ',
	vnpay: 'QR Code / VNPay',
	momo: 'Ví MoMo',
	pay_at_property: 'Thanh toán tại homestay',
};

/** `color` là preset color của antd Tag. */
export const STATUS_LABELS: Record<ReservationStatus, { label: string; color: string }> = {
	pending_payment: { label: 'Chờ thanh toán', color: 'gold' },
	confirmed: { label: 'Đã xác nhận', color: 'blue' },
	checked_in: { label: 'Đang lưu trú', color: 'green' },
	checked_out: { label: 'Đã trả phòng', color: 'default' },
	cancelled: { label: 'Đã huỷ', color: 'red' },
	no_show: { label: 'Không đến', color: 'volcano' },
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { label: string; color: string }> = {
	unpaid: { label: 'Chưa thanh toán', color: 'orange' },
	paid: { label: 'Đã thanh toán', color: 'green' },
	refunded: { label: 'Đã hoàn tiền', color: 'purple' },
};

export const SOURCE_LABELS: Record<ReservationSource, string> = {
	website: 'Website',
	phone: 'Điện thoại',
	walk_in: 'Khách vãng lai',
	ota: 'OTA',
};

export const ACTION_LABELS: Record<ReservationAction, string> = {
	created: 'Tạo đặt phòng',
	updated: 'Cập nhật thông tin',
	payment_confirmed: 'Xác nhận thanh toán',
	checked_in: 'Nhận phòng',
	checked_out: 'Trả phòng',
	cancelled: 'Huỷ đặt phòng',
	no_show: 'Đánh dấu không đến',
};

export const STATUS_ORDER: ReservationStatus[] = [
	'pending_payment',
	'confirmed',
	'checked_in',
	'checked_out',
	'cancelled',
	'no_show',
];

export const COUNTRIES = [
	'Việt Nam',
	'Hàn Quốc',
	'Nhật Bản',
	'Trung Quốc',
	'Hoa Kỳ',
	'Úc',
	'Pháp',
	'Anh',
	'Khác',
];

export const ARRIVAL_TIMES = [
	'Chưa xác định',
	'12:00 – 14:00',
	'14:00 – 15:00',
	'15:00 – 18:00',
	'18:00 – 21:00',
	'Sau 21:00',
];

/**
 * `Reservation.children` là số trẻ em, nhưng antd Table mặc định coi trường `children` của bản ghi là
 * hàng con (lồng nhau) và sẽ lỗi. Truyền tên này vào `childrenColumnName` của mọi Table hiển thị Reservation.
 */
export const NO_NESTED_ROWS = '__nested_rows__'

export function toOptions<T extends string>(labels: Record<T, string>) {
	return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
