import React from 'react';
import { Providers } from './src/Providers';
import { Navigation } from './src/navigation/Navigation';

export default function App(): JSX.Element {
  return (
    <Providers>
      <Navigation />
    </Providers>
  );
}
