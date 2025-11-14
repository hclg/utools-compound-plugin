import CompoundInterestCalculator from './pages/CompoundInterestCalculator';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '复利计算器',
    path: '/',
    element: <CompoundInterestCalculator />,
  },
];

export default routes;