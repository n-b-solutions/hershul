import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { Home } from '@/pages/home/Home';
import { Settings } from '@/pages/minyanim/Settings';
import { NotFoundPage } from '@/pages/NotFound';
import { Layout as MarketingLayout } from '@/components/marketing/layout/layout';
import Header from '@/components/header/Header';

export const routes: RouteObject[] = [
  {
    element: (
      <>
        <Header />
        <MarketingLayout>
          <Outlet />
        </MarketingLayout>
      </>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: '/settings', element: <Settings /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];
