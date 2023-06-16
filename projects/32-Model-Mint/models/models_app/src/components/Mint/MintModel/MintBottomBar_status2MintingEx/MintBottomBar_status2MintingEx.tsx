import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconMintCubeSta } from '../IconCollection_iconMintCubeSta/IconCollection_iconMintCubeSta';
import classes from './MintBottomBar_status2MintingEx.module.css';
import { WarningIcon } from './WarningIcon';

interface Props {
  className?: string;
  classes?: {
    union?: string;
    root?: string;
  };
  swap?: {
    warning?: ReactNode;
  };
}
/* @figmaId 342:6152 */
export const MintBottomBar_status2MintingEx: FC<Props> = memo(function MintBottomBar_status2MintingEx(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame2675}>
        <div className={classes.trainButton}>
          <div className={classes.frame2647}>
            <IconCollection_iconMintCubeSta classes={{ union: `${props.classes?.union || ''} ${classes.union}` }} />
            <div className={classes.minting}>Minting</div>
          </div>
        </div>
        <div className={classes.frame2677}>
          <div className={classes.warning}>{props.swap?.warning || <WarningIcon className={classes.icon} />}</div>
          <div className={classes.mintingIsIrreversibleYouCannot}>
            Minting is irreversible; you cannot delete this model from the marketplace.{' '}
          </div>
        </div>
      </div>
    </div>
  );
});
