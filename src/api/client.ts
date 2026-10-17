import axios, { isAxiosError } from 'axios'

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Cầu nối tới Redux (đăng ký ở app/bootstrap.ts) để tránh import vòng giữa api ↔ store. */
interface AuthBridge {
  getToken: () => string | null
  onUnauthorized: () => void
}

let bridge: AuthBridge = { getToken: () => null, onUnauthorized: () => {} }

export function registerAuthBridge(next: AuthBridge) {
  bridge = next
}

export const http = axios.create({ baseURL: API_URL, timeout: 15_000 })

http.interceptors.request.use((config) => {
  const token = bridge.getToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError<{ message?: string }>(error)) return Promise.reject(error)

    if (!error.response) {
      return Promise.reject(
        new ApiError(
          0,
          `Không kết nối được máy chủ API (${API_URL}). Hãy chạy "npm run dev" trong thư mục mock-api.`,
        ),
      )
    }

    const { status, data } = error.response
    if (status === 401 && !error.config?.url?.includes('/login')) bridge.onUnauthorized()
    return Promise.reject(new ApiError(status, data?.message ?? `Lỗi máy chủ (${status}).`))
  },
)

/** Bỏ các tham số rỗng trước khi gửi lên query string. */
export function cleanParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>
}
