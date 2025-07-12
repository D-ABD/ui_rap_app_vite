// src/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      backgroundLight: string;
      surface: string;
      text: string;
      primary: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      accent: string;
      secondary: string;
      disabled: string;
      border: string;
      white: string;
      black: string;
      gray: string;
      // 🔒 Ajout sécurisé de couleurs supplémentaires sans casser
      [key: string]: string;
    };
    spacing: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
    };
    fontSizes: {
      small: string;
      body: string;
      title: string;
      header: string;
    };
    borderRadius: {
      s: string;
      m: string;
      l: string;
    };
    fontWeights: {
      normal: number;
      medium: number;
      bold: number;
    };
  }
}
