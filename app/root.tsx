import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeContextProvider } from "./context/ThemeContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hệ Thống Quản Lý Khách Sạn & Homestay - Admin Portal</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeContextProvider>{children}</ThemeContextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Có lỗi xảy ra!";
  let details = "Vui lòng kiểm tra lại thao tác.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Không tìm thấy trang" : "Lỗi hệ thống";
    details =
      error.status === 404
        ? "Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-2xl font-bold text-red-600">{message}</h1>
      <p className="text-gray-500 mt-2">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto text-left bg-gray-100 dark:bg-gray-800 rounded-lg mt-4 text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
