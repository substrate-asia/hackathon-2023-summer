import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './IconCollection_iconSendStatusD.module.css';
import { SendIcon } from './SendIcon';

interface Props {
  className?: string;
  classes?: {
    send?: string;
  };
  swap?: {
    send?: ReactNode;
  };
}
/* @figmaId 336:5192 */
export const IconCollection_iconSendStatusD: FC<Props> = memo(function IconCollection_iconSendStatusD(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.send || ''} ${classes.send}`}>
        {props.swap?.send || <SendIcon className={classes.icon} />}
      </div>
    </div>
  );
});
