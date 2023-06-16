import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconEthStatusDe.module.css';
import { UnionIcon } from './UnionIcon';

interface Props {
  className?: string;
  classes?: {
    union?: string;
  };
}
/* @figmaId 336:5616 */
export const IconCollection_iconEthStatusDe: FC<Props> = memo(function IconCollection_iconEthStatusDe(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.union || ''} ${classes.union}`}>
        <UnionIcon className={classes.icon} />
      </div>
    </div>
  );
});
