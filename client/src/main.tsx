import * as React from 'react';
import { Root } from '@/root';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { routes } from '@/routes/index.route';
import { ScrollRestoration } from '@/components/core/scroll-restoration';

import { store } from './redux/store';
import { sendGeonameidToServer } from './services/local.service';

const root = createRoot(document.getElementById('root')!);
document.title = import.meta.env.VITE_NAME || 'Default Title';

const startApp = async () => {
  try {
    await sendGeonameidToServer();
    // Now you can safely make other API calls or initialize your app
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
  } catch (error) {
    console.error('Failed to initialize the app:', error);
  }
};

startApp();
