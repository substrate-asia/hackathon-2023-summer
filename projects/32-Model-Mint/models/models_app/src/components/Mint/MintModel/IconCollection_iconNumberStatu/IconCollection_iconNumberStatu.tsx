import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconNumberStatu.module.css';
import { NumbersIcon } from './NumbersIcon';

interface Props {
  className?: string;
  classes?: {
    numbers?: string;
  };
  swap?: {
    numbers?: ReactNode;
  };
}
/* @figmaId 336:5685 */
export const IconCollection_iconNumberStatu: FC<Props> = memo(function IconCollection_iconNumberStatu(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.numbers || ''} ${classes.numbers}`}>
        {props.swap?.numbers || <NumbersIcon className={classes.icon} />}
      </div>
    </div>
  );
});
