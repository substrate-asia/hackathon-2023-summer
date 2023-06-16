import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconMintCubeSta.module.css';
import { UnionIcon } from './UnionIcon';

interface Props {
  className?: string;
  classes?: {
    union?: string;
  };
}
/* @figmaId 334:4669 */
export const IconCollection_iconMintCubeSta: FC<Props> = memo(function IconCollection_iconMintCubeSta(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.union || ''} ${classes.union}`}>
        <UnionIcon className={classes.icon} />
      </div>
    </div>
  );
});
