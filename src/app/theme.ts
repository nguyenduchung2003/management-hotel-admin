import { theme as antdTheme, type ThemeConfig } from 'antd'

// Màu thương hiệu đồng bộ với site khách (fe): vàng đồng + xanh rêu.
export const BRAND = {
  gold: '#BF882E',
  goldDark: '#9E7026',
  forest: '#0F332C',
}

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND.gold,
    colorLink: BRAND.goldDark,
    colorInfo: '#2F6F8F',
    colorSuccess: '#2E7D5B',
    colorWarning: '#D98A1F',
    colorError: '#C0392B',
    colorText: '#2B2F33',
    borderRadius: 8,
    fontFamily: "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
  },
  components: {
    Layout: { bodyBg: '#F5F6F8', headerBg: '#FFFFFF', siderBg: BRAND.forest },
    Table: { headerBg: '#FAFAF7', rowHoverBg: '#FBF7EE' },
  },
}

/** Theme tối cho thanh bên (xanh rêu) — bọc quanh Menu trong Sider. */
export const siderTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: { colorPrimary: BRAND.gold },
  components: {
    Menu: {
      itemBg: 'transparent',
      itemColor: 'rgba(255,255,255,0.78)',
      itemHoverBg: 'rgba(255,255,255,0.07)',
      itemHoverColor: '#FFFFFF',
      itemSelectedBg: 'rgba(191,136,46,0.24)',
      itemSelectedColor: '#F0CB8A',
      itemBorderRadius: 8,
    },
  },
}
