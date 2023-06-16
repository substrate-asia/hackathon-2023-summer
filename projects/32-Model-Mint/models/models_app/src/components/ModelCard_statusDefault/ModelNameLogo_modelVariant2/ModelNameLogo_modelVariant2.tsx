import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import { Frame10Icon } from './Frame10Icon.tsx';
import classes from './ModelNameLogo_modelVariant2.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
}
/* @figmaId 23:735 */
export const ModelNameLogo_modelVariant2: FC<Props> = memo(function ModelNameLogo_modelVariant2(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.frame10}>
        <Frame10Icon className={classes.icon} />
      </div>
      <div className={classes.curie}>curie</div>
    </div>
  );
});
