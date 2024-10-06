import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata.type';
import { config } from '@/config';
import { Analytics } from '@/components/core/analytics';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';

const metadata: Metadata = { title: config.site.name };

interface RootProps {
  children: React.ReactNode;
}

export function Root({ children }: RootProps): React.JSX.Element {
  return (
    <HelmetProvider>
      <Helmet>
        <meta content={config.site.themeColor} name="theme-color" />
        <title>{metadata.title}</title>
      </Helmet>
      <Analytics>
        <LocalizationProvider>
          <ThemeProvider>
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </LocalizationProvider>
      </Analytics>
    </HelmetProvider>
  );
}
