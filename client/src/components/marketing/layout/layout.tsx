import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            height: '100vh',
            '--MainNav-height': '72px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <div style={{ height: 'calc(100vh - 42px)' }}>{children}</div>
    </React.Fragment>
  );
}
