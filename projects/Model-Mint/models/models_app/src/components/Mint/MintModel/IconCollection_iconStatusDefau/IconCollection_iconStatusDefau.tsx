import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconStatusDefau.module.css';
import { PercentIcon } from './PercentIcon';

interface Props {
  className?: string;
  classes?: {
    percent?: string;
  };
  swap?: {
    percent?: ReactNode;
  };
}
/* @figmaId 337:5808 */
export const IconCollection_iconStatusDefau: FC<Props> = memo(function IconCollection_iconStatusDefau(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.percent || ''} ${classes.percent}`}>
        {props.swap?.percent || <PercentIcon className={classes.icon} />}
      </div>
    </div>
  );
});
