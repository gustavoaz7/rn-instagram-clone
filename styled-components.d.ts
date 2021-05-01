/* eslint-disable import/order */
import { TTheme } from './src/styles/theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends TTheme {}
}
