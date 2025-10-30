// Design System for Metro Optics
export const COLORS = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  
  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  
  // Category Colors
  categories: {
    eyeglasses: '#3b82f6', // blue-600
    sunglasses: '#f59e0b', // amber-500
    contactLenses: '#8b5cf6', // violet-500
    kids: '#22c55e', // green-500
    deals: '#ef4444', // red-500
    new: '#10b981' // emerald-500
  }
}

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
}

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px'
}

export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
}

export const LINE_HEIGHTS = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75'
}

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
}

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

// Utility functions for consistent styling
export const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    eyeglasses: COLORS.categories.eyeglasses,
    sunglasses: COLORS.categories.sunglasses,
    'contact-lenses': COLORS.categories.contactLenses,
    kids: COLORS.categories.kids,
    deals: COLORS.categories.deals
  }
  return colorMap[category] || COLORS.primary[600]
}

export const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: { bg: string; text: string } } = {
    success: { bg: COLORS.success[100], text: COLORS.success[800] },
    error: { bg: COLORS.error[100], text: COLORS.error[800] },
    warning: { bg: COLORS.warning[100], text: COLORS.warning[800] },
    info: { bg: COLORS.primary[100], text: COLORS.primary[800] }
  }
  return statusMap[status] || statusMap.info
}

export const getResponsiveValue = (values: { [key: string]: string }) => {
  // Returns responsive value object for Tailwind classes
  return values
}

// Component-specific spacing
export const COMPONENT_SPACING = {
  card: {
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    },
    margin: {
      sm: 'm-2',
      md: 'm-4',
      lg: 'm-6'
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    }
  },
  button: {
    padding: {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3'
    },
    gap: 'gap-2'
  },
  input: {
    padding: {
      sm: 'px-3 py-2',
      md: 'px-4 py-2.5',
      lg: 'px-4 py-3'
    }
  }
}