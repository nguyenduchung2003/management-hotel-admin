import type { Reservation, ReservationStatus } from '@/types/reservation';
import { formatDate, todayISO } from '@/utils/stay';

// Luật chuyển trạng thái — mock server dùng để chặn request sai, UI dùng để ẩn/khoá nút.
// Khi có BE: BE vẫn phải tự kiểm tra, file này chỉ còn vai trò hiển thị.

export type AdminAction = 'confirm_payment' | 'check_in' | 'check_out' | 'no_show' | 'cancel';

const ACTION_STATUSES: Record<AdminAction, ReservationStatus[]> = {
	confirm_payment: ['pending_payment', 'confirmed', 'checked_in'],
	check_in: ['confirmed'],
	check_out: ['checked_in'],
	no_show: ['confirmed'],
	cancel: ['pending_payment', 'confirmed'],
};

/** Thao tác có áp dụng cho trạng thái hiện tại không (để quyết định hiển thị nút). */
export function isActionVisible(action: AdminAction, reservation: Reservation): boolean {
	if (action === 'confirm_payment' && reservation.paymentStatus !== 'unpaid') return false;
	return ACTION_STATUSES[action].includes(reservation.status);
}

/** Lý do không thực hiện được thao tác; null = hợp lệ. */
export function actionError(
	action: AdminAction,
	reservation: Reservation,
	today = todayISO(),
): string | null {
	if (!isActionVisible(action, reservation)) {
		return 'Thao tác không hợp lệ với trạng thái hiện tại của đặt phòng.';
	}
	switch (action) {
		case 'check_in':
			if (today < reservation.checkIn) {
				return `Chưa đến ngày nhận phòng (${formatDate(reservation.checkIn)}).`;
			}
			if (today >= reservation.checkOut) return 'Đã qua ngày trả phòng, không thể nhận phòng.';
			return null;
		case 'check_out':
			return reservation.paymentStatus === 'paid'
				? null
				: 'Vui lòng xác nhận thanh toán trước khi trả phòng.';
		case 'no_show':
			return today < reservation.checkIn ? 'Chỉ đánh dấu không đến từ ngày nhận phòng.' : null;
		default:
			return null;
	}
}

/** Còn trong hạn huỷ miễn phí theo gói giá. */
export function isFreeCancel(reservation: Reservation, today = todayISO()): boolean {
	return (
		reservation.refundable &&
		reservation.freeCancelUntil !== null &&
		today <= reservation.freeCancelUntil
	);
}
