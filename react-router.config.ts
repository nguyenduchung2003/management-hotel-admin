import type { Config } from "@react-router/dev/config";

export default {
  // Admin nội bộ không cần SEO/SSR; tắt SSR để tránh mất style CSS-in-JS
  // của Ant Design v6 (Sider/Menu/Header không có entry.server để extract style).
  ssr: false,
} satisfies Config;
