import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { Auto_read_playIcon } from './Auto_read_playIcon';
import classes from './IconCollection_iconGenerateOut.module.css';

interface Props {
  className?: string;
  classes?: {
    auto_read_play?: string;
  };
  swap?: {
    auto_read_play?: ReactNode;
  };
}
/* @figmaId 314:3981 */
export const IconCollection_iconGenerateOut: FC<Props> = memo(function IconCollection_iconGenerateOut(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.auto_read_play || ''} ${classes.auto_read_play}`}>
        {props.swap?.auto_read_play || <Auto_read_playIcon className={classes.icon} />}
      </div>
    </div>
  );
});
