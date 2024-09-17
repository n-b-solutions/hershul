import * as React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { Page as HomePage } from '@/pages/home/home';
import { Page as Minyanim } from '@/pages/minyanim/minyanim';
import { Page as NotFoundPage } from '@/pages/not-found';
import Header from '@/components/marketing/home/header';
import { Layout as MarketingLayout } from '@/components/marketing/layout/layout';

import { route as authRoute } from './auth';
import { route as dashboardRoute } from './dashboard';

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
      { index: true, element: <HomePage /> },
      { path: '/setting', element: <Minyanim /> }, // הגדר את /setting כאן כך שגם ה-Header יוצג
    ],
  },
  authRoute,
  dashboardRoute,
  { path: '*', element: <NotFoundPage /> },
];

