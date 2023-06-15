import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './FilterIcons_iconProductivity.module.css';
import { Library_add_checkIcon } from './Library_add_checkIcon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    library_add_check?: ReactNode;
  };
}
/* @figmaId 223:3807 */
export const FilterIcons_iconProductivity: FC<Props> = memo(function FilterIcons_iconProductivity(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.library_add_check}>
        {props.swap?.library_add_check || <Library_add_checkIcon className={classes.icon} />}
      </div>
    </div>
  );
});
