import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { BrushIcon } from './BrushIcon';
import classes from './FilterIcons_iconArt.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    brush?: ReactNode;
  };
}
/* @figmaId 209:3094 */
export const FilterIcons_iconArt: FC<Props> = memo(function FilterIcons_iconArt(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.brush}>{props.swap?.brush || <BrushIcon className={classes.icon} />}</div>
    </div>
  );
});
