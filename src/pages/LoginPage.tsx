import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Form, Input } from 'antd'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { login } from '@/api/admin'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedIn } from '@/app/slices/authSlice'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

interface LoginValues {
  username: string
  password: string
}

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector((state) => state.auth.token)
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => login(values.username.trim(), values.password),
    onSuccess: (result) => {
      dispatch(loggedIn(result))
      navigate(from, { replace: true })
    },
  })

  if (token) return <Navigate to={from} replace />

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-forest p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full border border-gold font-serif text-xl font-bold text-gold">
            H
          </span>
          <span className="font-serif text-xl font-bold tracking-wider uppercase">Tên Homestay</span>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Cổng quản trị</p>
          <h2 className="font-serif text-4xl leading-tight text-white">
            Quản lý đặt phòng gọn gàng, mọi lúc mọi nơi
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/75">
            Theo dõi khách đến – đi trong ngày, xác nhận thanh toán, nhận/trả phòng và xem lịch phòng trong một nơi.
          </p>
        </div>
        <p className="text-xs text-white/50">Bản demo · dữ liệu giả lập từ mock-api</p>
      </div>

      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-semibold text-ink">Đăng nhập</h1>
          <p className="mb-6 text-sm text-muted">Dành cho nhân viên và quản lý homestay.</p>

          {mutation.isError && (
            <Alert type="error" showIcon title={mutation.error.message} className="mb-4" />
          )}

          <Form<LoginValues>
            layout="vertical"
            requiredMark={false}
            disabled={mutation.isPending}
            initialValues={{ username: 'admin' }}
            onFinish={(values) => mutation.mutate(values)}
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input prefix={<UserOutlined />} size="large" autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" autoComplete="current-password" autoFocus />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={mutation.isPending}>
              Đăng nhập
            </Button>
          </Form>

          <p className="mt-6 rounded-lg bg-canvas px-4 py-3 text-xs leading-relaxed text-muted">
            Tài khoản demo: <b className="text-ink">admin</b> / <b className="text-ink">admin123</b>
            <br />
            (chỉ dùng cho mock-api, sẽ thay bằng đăng nhập thật khi có BE)
          </p>
        </div>
      </div>
    </div>
  )
}
