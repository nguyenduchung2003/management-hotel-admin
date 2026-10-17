import { Alert, Button } from 'antd'

export function QueryError({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Alert
      type="error"
      showIcon
      title="Không tải được dữ liệu"
      description={error.message}
      action={onRetry ? <Button size="small" onClick={onRetry}>Thử lại</Button> : undefined}
    />
  )
}
