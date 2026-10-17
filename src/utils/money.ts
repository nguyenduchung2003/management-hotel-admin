/** 890000 → "890.000đ" (giống fe). */
export function formatVND(amount: number): string {
	return `${Math.round(amount).toLocaleString('vi-VN')}đ`;
}

/** 12500000 → "12,5 tr" — dùng cho số liệu tổng quan. */
export function formatCompactVND(amount: number): string {
	if (Math.abs(amount) >= 1_000_000_000) {
		return `${(amount / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
	}
	if (Math.abs(amount) >= 1_000_000) {
		return `${(amount / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
	}
	return formatVND(amount);
}
