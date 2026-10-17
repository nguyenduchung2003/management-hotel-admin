import dayjs from 'dayjs';
import 'dayjs/locale/vi';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function todayISO(): string {
	return dayjs().format(DATE_FORMAT);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
	return Math.max(1, dayjs(checkOut).diff(dayjs(checkIn), 'day'));
}

/** "2026-11-20" → "T6, 20/11/2026" */
export function formatStayDate(isoDate: string): string {
	return dayjs(isoDate).locale('vi').format('dd, DD/MM/YYYY').replace(/^./, (c) => c.toUpperCase());
}

/** "2026-11-20" → "20/11/2026" */
export function formatDate(isoDate: string): string {
	return dayjs(isoDate).format('DD/MM/YYYY');
}

/** ISO datetime → "20/11/2026 14:05" */
export function formatDateTime(isoDateTime: string): string {
	return dayjs(isoDateTime).format('DD/MM/YYYY HH:mm');
}

export function guestLabel(adults: number, children: number): string {
	return children > 0 ? `${adults} người lớn, ${children} trẻ em` : `${adults} người lớn`;
}
