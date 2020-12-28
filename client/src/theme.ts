import { Theme } from '@emotion/react';

const SPACING = 8;

export const THEME = {
  spacing(multiplier = 1) {
    return SPACING * multiplier;
  },

  get gap() {
    return THEME.spacing(3);
  },

  get padding() {
    return THEME.spacing(1);
  },

  get borderRadius() {
    return THEME.spacing() / 2;
  },
};

THEME.spacing.toString = () => String(THEME.spacing(1));

export type DefaultTheme = typeof THEME & Theme;
