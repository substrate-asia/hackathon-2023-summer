import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './Frame_statusDefault.module.css';
import { VectorIcon } from './VectorIcon';

interface Props {
  className?: string;
}
/* @figmaId 342:6677 */
export const Frame_statusDefault: FC<Props> = memo(function Frame_statusDefault(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.vector}>
        <VectorIcon className={classes.icon} />
      </div>
    </div>
  );
});
