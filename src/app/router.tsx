import { createBrowserRouter } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { RequireAuth } from '@/layouts/RequireAuth'
import CalendarPage from '@/pages/CalendarPage'
import DashboardPage from '@/pages/DashboardPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ReservationCreatePage from '@/pages/ReservationCreatePage'
import ReservationDetailPage from '@/pages/ReservationDetailPage'
import ReservationsPage from '@/pages/ReservationsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dat-phong', element: <ReservationsPage /> },
          { path: 'dat-phong/moi', element: <ReservationCreatePage /> },
          { path: 'dat-phong/:code', element: <ReservationDetailPage /> },
          { path: 'lich-phong', element: <CalendarPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
