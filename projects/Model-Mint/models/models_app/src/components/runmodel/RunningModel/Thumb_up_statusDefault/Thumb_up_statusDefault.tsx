import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './Thumb_up_statusDefault.module.css';
import { Thumb_upIcon } from './Thumb_upIcon';

interface Props {
  className?: string;
  classes?: {
    thumb_up?: string;
  };
}
/* @figmaId 342:6715 */
export const Thumb_up_statusDefault: FC<Props> = memo(function Thumb_up_statusDefault(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={`${props.classes?.thumb_up || ''} ${classes.thumb_up}`}>
        <Thumb_upIcon className={classes.icon} />
      </div>
    </div>
  );
});
