import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Icon } from './Icon';
import classes from './IconCollection_iconPlusStatusD.module.css';

interface Props {
  className?: string;
  classes?: {
    unnamed?: string;
    root?: string;
  };
  swap?: {
    unnamed?: ReactNode;
  };
}
/* @figmaId 314:3978 */
export const IconCollection_iconPlusStatusD: FC<Props> = memo(function IconCollection_iconPlusStatusD(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={`${props.classes?.unnamed || ''} ${classes.unnamed}`}>
        {props.swap?.unnamed || <Icon className={classes.icon} />}
      </div>
    </div>
  );
});
