import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { IconCollection_iconGenerateOut } from '../IconCollection_iconGenerateOut/IconCollection_iconGenerateOut';
import { Auto_read_playIcon } from './Auto_read_playIcon';
import classes from './GenerateOutput_statusDefault2.module.css';

interface Props {
  className?: string;
  classes?: {
    auto_read_play?: string;
    root?: string;
  };
  swap?: {
    auto_read_play?: ReactNode;
  };
}
/* @figmaId 375:3894 */
export const GenerateOutput_statusDefault2: FC<Props> = memo(function GenerateOutput_statusDefault2(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <IconCollection_iconGenerateOut
        classes={{ auto_read_play: `${props.classes?.auto_read_play || ''} ${classes.auto_read_play}` }}
        swap={{
          auto_read_play: props.swap?.auto_read_play || (
            <div className={classes.auto_read_play}>
              <Auto_read_playIcon className={classes.icon} />
            </div>
          ),
        }}
      />
      <div  className={classes.createAModel}>
        Generate output
        </div>
    </div>
  );
});
