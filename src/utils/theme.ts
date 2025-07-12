export const palette = {
  primary: '#5A31F4',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  accent: '#FF2D55',
  secondary: '#A284F6',
  disabled: '#C7C7CC',

  background: '#F0F2F3',
  backgroundLight: '#f8f9fa',
  text: '#0B0B0B',
  white: '#ffffff',
  black: '#0B0B0B',
  gray: '#D9DBE1',
  border: '#D9DBE1',
};

export const lightTheme = {
  colors: {
    
    background: palette.background,
    backgroundLight: palette.backgroundLight,
    surface: palette.white,
    text: palette.text,
    primary: palette.primary,
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    accent: palette.accent,
    secondary: palette.secondary,
    disabled: palette.disabled,
    border: palette.border,
    white: palette.white,
    black: palette.black,
    gray: palette.gray,
  },
  spacing: {
    xs: '4px',
    s: '8px',
    m: '16px',
    l: '24px',
    xl: '32px',
  },
  fontSizes: {
    small: '14px',
    body: '16px',
    title: '20px',
    header: '28px',
  },
  borderRadius: {
    s: '4px',
    m: '8px',
    l: '12px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.black,
    text: palette.white,
    surface: '#1c1c1e',
    border: '#333',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
