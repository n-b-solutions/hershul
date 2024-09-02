import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store'; // או הנתיב הנכון שלך
import { Root } from '@/root';
import { routes } from '@/routes';
import { ScrollRestoration } from '@/components/core/scroll-restoration';

const root = createRoot(document.getElementById('root')!);

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
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
