import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './FilterIcons_iconCode.module.css';
import { Frame_sourceIcon } from './Frame_sourceIcon';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    frame_source?: ReactNode;
  };
}
/* @figmaId 209:3114 */
export const FilterIcons_iconCode: FC<Props> = memo(function FilterIcons_iconCode(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame_source}>
        {props.swap?.frame_source || <Frame_sourceIcon className={classes.icon} />}
      </div>
    </div>
  );
});
