import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
};

export default preview;
