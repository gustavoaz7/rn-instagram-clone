import React from 'react';
import { Providers } from './src/Providers';
import { Root } from './src/Root';

export default function App(): JSX.Element {
  return (
    <Providers>
      <Root />
    </Providers>
  );
}
