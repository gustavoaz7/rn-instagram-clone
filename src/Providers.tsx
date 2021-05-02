import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
