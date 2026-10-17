import { Button, Result } from 'antd'
import { Link } from 'react-router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang')
  return (
    <Result
      status="404"
      title="Không tìm thấy trang"
      subTitle="Đường dẫn bạn truy cập không tồn tại."
      extra={
        <Link to="/">
          <Button type="primary">Về trang tổng quan</Button>
        </Link>
      }
    />
  )
}
