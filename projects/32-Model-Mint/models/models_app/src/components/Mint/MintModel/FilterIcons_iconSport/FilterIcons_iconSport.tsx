import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './FilterIcons_iconSport.module.css';
import { Sports_basketballIcon } from './Sports_basketballIcon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    sports_basketball?: ReactNode;
  };
}
/* @figmaId 209:3104 */
export const FilterIcons_iconSport: FC<Props> = memo(function FilterIcons_iconSport(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.sports_basketball}>
        {props.swap?.sports_basketball || <Sports_basketballIcon className={classes.icon} />}
      </div>
    </div>
  );
});
