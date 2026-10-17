import { StyleProvider } from '@ant-design/cssinjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { useState, type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ApiError } from '@/api/client'
import { store } from './store'
import { appTheme } from './theme'

dayjs.locale('vi')

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            // Lỗi 4xx là lỗi nghiệp vụ/phiên → không thử lại; mất kết nối hoặc 5xx thì thử thêm 1 lần.
            retry: (failureCount, error) =>
              !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 1,
          },
        },
      }),
  )

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* layer: style antd nằm trong @layer antd (khai báo ở index.css) để Tailwind luôn ưu tiên */}
        <StyleProvider layer>
          <ConfigProvider locale={viVN} theme={appTheme}>
            <AntdApp>{children}</AntdApp>
          </ConfigProvider>
        </StyleProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
