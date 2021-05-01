import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Navigation } from './src/navigation/Navigation';
import { theme } from './src/styles/theme';

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
}
