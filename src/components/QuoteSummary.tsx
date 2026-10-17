import type { BookingQuote } from '@/types/reservation'
import { formatVND } from '@/utils/money'

export function QuoteSummary({ quote }: { quote: BookingQuote }) {
  return (
    <div className="text-sm">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {quote.lines.map((line) => (
          <li key={line.label} className="flex justify-between gap-4">
            <span>{line.label}</span>
            <span className={line.amount < 0 ? 'font-medium text-[#2E7D5B]' : 'font-medium text-ink'}>
              {formatVND(line.amount)}
            </span>
          </li>
        ))}
        <li className="flex justify-between gap-4 text-muted">
          <span>Thuế & phí</span>
          <span>Đã bao gồm</span>
        </li>
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="font-semibold text-ink">Tổng cộng</span>
        <span className="text-xl font-bold text-gold-dark">{formatVND(quote.total)}</span>
      </div>
    </div>
  )
}
