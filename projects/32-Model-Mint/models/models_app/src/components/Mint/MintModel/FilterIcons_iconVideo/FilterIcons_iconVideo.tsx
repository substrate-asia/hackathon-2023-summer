import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import { Auto_videocamIcon } from './Auto_videocamIcon';
import classes from './FilterIcons_iconVideo.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
}
/* @figmaId 209:3057 */
export const FilterIcons_iconVideo: FC<Props> = memo(function FilterIcons_iconVideo(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.auto_videocam}>
        <Auto_videocamIcon className={classes.icon} />
      </div>
    </div>
  );
});
