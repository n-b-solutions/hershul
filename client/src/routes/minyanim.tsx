import * as React from 'react';
import type { RouteObject } from 'react-router-dom';


export const route: RouteObject = {
  path: 'minyanim',
  children: [
    {
      index: true,
      lazy: async () => {
        const { Page } = await import('@/pages/minyanim/minyanim');
        return { Component: Page };
      },
    },
  ],
};