import { memo } from 'react';
import type { FC } from 'react';
import React from 'react';
import classes from './App.module.css';
import resets from './components/mainpage/_resets.module.css';
import { HomepageLoggedIn } from './components/mainpage/HomepageLoggedIn/HomepageLoggedIn';

interface Props {
  className?: string;
}
export const MarkerplaceMainPage: FC<Props> = memo(function App(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <HomepageLoggedIn />
    </div>
  );
});

export default MarkerplaceMainPage;