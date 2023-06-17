import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './FilterIcons_iconLegal.module.css';
import { PolicyIcon } from './PolicyIcon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    policy?: ReactNode;
  };
}
/* @figmaId 209:3130 */
export const FilterIcons_iconLegal: FC<Props> = memo(function FilterIcons_iconLegal(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.policy}>{props.swap?.policy || <PolicyIcon className={classes.icon} />}</div>
    </div>
  );
});
