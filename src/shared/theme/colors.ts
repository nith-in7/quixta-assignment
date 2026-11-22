export interface ColorPalette {
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceSelected: string;

  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    accent: string;
  };

  border: {
    subtle: string;
    strong: string;
    focus: string;
  };

  brand: {
    primary: string;
    primaryText: string;
    accent: string;
  };

  status: {
    success: string;
    successSurface: string;
    error: string;
    errorSurface: string;
    warning: string;
  };

  disabled: {
    surface: string;
    text: string;
    border: string;
  };
}

export const lightColors: ColorPalette = {
  background: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceSubtle: '#F5F5F4',
  surfaceSelected: '#E7E5E4',

  text: {
    primary: '#1C1917',
    secondary: '#57534E',
    muted: '#A8A29E',
    inverse: '#FFFFFF',
    accent: '#1D4ED8',
  },

  border: {
    subtle: '#E7E5E4',
    strong: '#D6D3D1',
    focus: '#1D4ED8',
  },

  brand: {
    primary: '#1C1917',
    primaryText: '#FFFFFF',
    accent: '#1D4ED8',
  },

  status: {
    success: '#15803D',
    successSurface: '#F0FDF4',
    error: '#B91C1C',
    errorSurface: '#FEF2F2',
    warning: '#D97706',
  },

  disabled: {
    surface: '#E7E5E4',
    text: '#A8A29E',
    border: '#E7E5E4',
  },
};

export const darkColors: ColorPalette = {
  background: '#0C0A09',
  surface: '#1C1917',
  surfaceSubtle: '#292524',
  surfaceSelected: '#44403C',

  text: {
    primary: '#F5F5F4',
    secondary: '#A8A29E',
    muted: '#78716C',
    inverse: '#1C1917',
    accent: '#60A5FA',
  },

  border: {
    subtle: '#292524',
    strong: '#44403C',
    focus: '#3B82F6',
  },

  brand: {
    primary: '#F5F5F4',
    primaryText: '#1C1917',
    accent: '#3B82F6',
  },

  status: {
    success: '#22C55E',
    successSurface: '#052E16',
    error: '#EF4444',
    errorSurface: '#450A0A',
    warning: '#F59E0B',
  },

  disabled: {
    surface: '#292524',
    text: '#78716C',
    border: '#292524',
  },
};

export type ThemeColors = ColorPalette;
