import React from 'react';
import { Outlet } from 'react-router';
import { StackedCircularFooter } from './components/ui/stacked-circular-footer';

const App = () => {
  return (
    <div>
      <Outlet />
      <StackedCircularFooter />
    </div>
  );
};

export default App;
