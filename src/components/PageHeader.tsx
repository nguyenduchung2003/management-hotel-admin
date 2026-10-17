import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  extra?: ReactNode
  /** Đường dẫn quay lại (hiện nút mũi tên). */
  backTo?: string
  backLabel?: string
}

export function PageHeader({ title, subtitle, extra, backTo, backLabel = 'Quay lại' }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {backTo && (
          <Link to={backTo} aria-label={backLabel}>
            <Button shape="circle" icon={<ArrowLeftOutlined />} />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="m-0 text-xl leading-tight font-semibold text-ink md:text-2xl">{title}</h1>
          {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
        </div>
      </div>
      {extra && <div className="flex flex-wrap items-center gap-2">{extra}</div>}
    </div>
  )
}
