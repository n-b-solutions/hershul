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
            '--MainNav-height': '72px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <div>
        {children}
      </div>
    </React.Fragment>
  );
}
