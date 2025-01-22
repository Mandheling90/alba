declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      [x: string]: any
      dark: string
      main: string
      mainTransparency?: string
      light: string
      bodyBg: string
      darkBg: string
      lightBg: string
      trackBg: string
      avatarBg: string
      tableHeaderBg: string
      primaryGradient: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string
      main?: string
      mainTransparency?: string
      light?: string
      bodyBg?: string
      darkBg?: string
      lightBg?: string
      trackBg?: string
      avatarBg?: string
      tableHeaderBg?: string
      primaryGradient?: string
    }
  }
}

export {}
