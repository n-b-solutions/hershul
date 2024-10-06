import type { RouteObject } from 'react-router-dom';

export const route: RouteObject = {
  path: 'settings',
  children: [
    {
      index: true,
      lazy: async () => {
        const { Settings } = await import('@/pages/minyanim/Settings');
        return { Component: Settings };
      },
    },
  ],
};
