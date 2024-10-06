'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';

import { config } from '@/config';
import { createTheme } from '@/styles/theme/create-theme';

import { Rtl } from './rtl';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {

  const theme = createTheme({
    colorScheme: config.site.colorScheme,
    primaryColor: config.site.primaryColor,
    direction: 'ltr',
  });

  return (
    <CssVarsProvider defaultColorScheme={config.site.colorScheme} defaultMode={config.site.colorScheme} theme={theme}>
      <Helmet>
        <meta content={config.site.colorScheme} name="color-scheme" />
      </Helmet>
      <CssBaseline />
      <Rtl direction={'ltr'}>{children}</Rtl>
    </CssVarsProvider>
  );
}
