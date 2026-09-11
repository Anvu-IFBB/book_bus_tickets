/**
 * Hệ thống Design Tokens tập trung cho Dự án Limousine VIP
 * Thương hiệu: Navy Hoàng Gia (#071A2B), Vàng Kim Sang Trọng (#D4AF37)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Colors
    navy: {
      950: '#030C14',
      900: '#071A2B', // PRIMARY BRAND NAVY
      800: '#0E2841',
      700: '#16385B',
      600: '#1F4B78',
      500: '#2C629A',
      400: '#467FBD',
      300: '#75A3D8',
      200: '#A9C7ED',
      100: '#D5E4F7',
      50: '#F0F5FC',
    },
    gold: {
      900: '#735B0F',
      800: '#947614',
      700: '#B5911B',
      600: '#C29B27', // HOVER
      500: '#D4AF37', // PRIMARY BRAND GOLD
      400: '#E0C25E',
      300: '#EBD58C',
      200: '#F4E7BD',
      100: '#FAF4DF',
      50: '#FDFBF2',
    },
    // Neutrals
    slate: {
      950: '#020617',
      900: '#0F172A', // Main Headings & Body Text
      800: '#1E293B',
      700: '#334155',
      600: '#475569', // Secondary Text
      500: '#64748B', // Muted Text
      400: '#94A3B8',
      300: '#CBD5E1', // Borders
      200: '#E2E8F0', // Light Borders
      100: '#F1F5F9', // Subtle Backgrounds
      50: '#F8FAFC',  // Main Canvas Background
      0: '#FFFFFF',   // Surface / White
    },
    // Semantic
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
      dark: '#15803D',
      border: '#86EFAC',
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7',
      dark: '#B45309',
      border: '#FCD34D',
    },
    danger: {
      main: '#DC2626',
      light: '#FEE2E2',
      dark: '#B91C1C',
      border: '#FCA5A5',
    },
    info: {
      main: '#2563EB',
      light: '#DBEAFE',
      dark: '#1D4ED8',
      border: '#93C5FD',
    },
  },

  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    card: '0 4px 20px -2px rgba(7, 26, 43, 0.06), 0 2px 6px -1px rgba(7, 26, 43, 0.04)',
    cardHover: '0 12px 30px -4px rgba(7, 26, 43, 0.12), 0 4px 10px -2px rgba(7, 26, 43, 0.06)',
    goldGlow: '0 0 25px -3px rgba(212, 175, 55, 0.35)',
    modal: '0 25px 50px -12px rgba(7, 26, 43, 0.25)',
    float: '0 10px 30px -5px rgba(7, 26, 43, 0.2)',
  },

  zIndex: {
    header: 40,
    modalBackdrop: 50,
    modalContent: 51,
    toast: 60,
    floatingAction: 30,
  },

  breakpoints: {
    mobileSmall: '320px',
    mobileRegular: '375px',
    mobileLarge: '414px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    desktopLarge: '1440px',
    desktopMax: '1920px',
  },
} as const;
