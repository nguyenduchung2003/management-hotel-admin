// Đồng bộ với fe/src/types/homestay.ts (phần admin cần dùng).

export type AmenityId =
	| 'wifi'
	| 'air-conditioner'
	| 'smart-tv'
	| 'shower'
	| 'bathtub'
	| 'minibar'
	| 'safe'
	| 'toiletries'
	| 'cotton-linen'
	| 'housekeeping'
	| 'breakfast'
	| 'balcony'
	| 'non-smoking'
	| 'work-desk'
	| 'skylight';

export type RoomCategory = 'standard' | 'deluxe' | 'suite' | 'family' | 'duplex';

export interface Room {
	id: string;
	slug: string;
	name: string;
	category: RoomCategory;
	summary: string;
	images: string[];
	areaM2: number;
	maxAdults: number;
	maxChildren: number;
	bedType: string;
	view: string;
	/** Giá niêm yết (giá trên OTA) — chỉ để hiển thị gạch ngang. */
	listPrice: number;
	/** Giá đặt trực tiếp / đêm cho gói linh hoạt. */
	basePrice: number;
	amenityIds: AmenityId[];
	totalUnits: number;
	featured: boolean;
}

export interface RatePlan {
	id: string;
	name: string;
	description: string;
	priceFactor: number;
	includesBreakfast: boolean;
	refundable: boolean;
	/** Số ngày trước ngày nhận phòng được huỷ miễn phí; null = không hoàn huỷ. */
	freeCancelDays: number | null;
}
