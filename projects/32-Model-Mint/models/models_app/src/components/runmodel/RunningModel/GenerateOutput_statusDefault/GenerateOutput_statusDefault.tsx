import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { GenerateOutput_statusDefault2 } from '../GenerateOutput_statusDefault2/GenerateOutput_statusDefault2';
import { Auto_read_playIcon } from './Auto_read_playIcon';
import classes from './GenerateOutput_statusDefault.module.css';

interface Props {
  className?: string;
  classes?: {
    auto_read_play?: string;
  };
  swap?: {
    auto_read_play?: ReactNode;
  };
}
/* @figmaId 456:5392 */
export const GenerateOutput_statusDefault: FC<Props> = memo(function GenerateOutput_statusDefault(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.rectangle335} ></div>
      <GenerateOutput_statusDefault2
        className={classes.generateOutput}
        classes={{ auto_read_play: `${props.classes?.auto_read_play || ''} ${classes.auto_read_play}` }}
        swap={{
          auto_read_play: props.swap?.auto_read_play || (
            <div className={classes.auto_read_play}>
              <Auto_read_playIcon className={classes.icon} />
            </div>
          ),
        }}
      />
    </div>
  );
});
