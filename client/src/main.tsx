import * as React from 'react';
import { Root } from '@/root';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { routes } from '@/routes';
import { ScrollRestoration } from '@/components/core/scroll-restoration';

import { store } from './state/store';

const root = createRoot(document.getElementById('root')!);
document.title = import.meta.env.VITE_NAME || 'Default Title';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Root>
        <ScrollRestoration />
        <Outlet />
      </Root>
    ),
    children: [...routes],
  },
]);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
