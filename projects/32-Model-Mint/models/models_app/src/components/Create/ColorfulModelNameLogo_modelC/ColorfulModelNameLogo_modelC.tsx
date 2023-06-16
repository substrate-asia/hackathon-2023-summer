import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './ColorfulModelNameLogo_modelC.module.css';
import { Frame10Icon } from './Frame10Icon';

interface Props {
  className?: string;
}
/* @figmaId 163:2284 */
export const ColorfulModelNameLogo_modelC: FC<Props> = memo(function ColorfulModelNameLogo_modelC(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame10}>
        <Frame10Icon className={classes.icon} />
      </div>
      <div className={classes.curie}>curie</div>
    </div>
  );
});
