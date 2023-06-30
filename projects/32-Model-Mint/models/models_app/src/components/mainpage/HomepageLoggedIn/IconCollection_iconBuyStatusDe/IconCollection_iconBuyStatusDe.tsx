import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconBuyStatusDe.module.css';
import { Local_mallIcon } from './Local_mallIcon';

interface Props {
  className?: string;
  classes?: {
    local_mall?: string;
    root?: string;
  };
  swap?: {
    local_mall?: ReactNode;
  };
}
/* @figmaId 316:4030 */
export const IconCollection_iconBuyStatusDe: FC<Props> = memo(function IconCollection_iconBuyStatusDe(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={`${props.classes?.local_mall || ''} ${classes.local_mall}`}>
        {props.swap?.local_mall || <Local_mallIcon className={classes.icon} />}
      </div>
    </div>
  );
});
